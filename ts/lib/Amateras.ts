import { Client, MessageEmbed, User } from "discord.js";
import { Db } from "mongodb";
import cmd from "../plugins/cmd";
import { _GuildManager } from "./_GuildManager";
import { _UserManager } from "./_UserManager";
import fs from 'fs'
import { System } from "./System";
import { _NotifierManager } from "./_NotifierManager";
import { _MessageManager } from "./_MessageManager";
import express, { Express } from 'express'
import test from '../etc/test'
import { EventManager } from "./_EventManager";
import { ConsoleData, ConsoleDB, ConsoleLoginInfo, ConsoleMessageOption } from "./Console.js";

export class Amateras {
    client: Client<true>;
    db: Db;
    me: User;
    users: _UserManager;
    guilds: _GuildManager;
    config: {};
    system: System;
    notifiers: _NotifierManager;
    messages: _MessageManager;
    ready: boolean;
    express: Express;
    events: EventManager;
    sessions: Map<string, ConsoleDB>;
    constructor(conf: AmaterasConfig) {
        this.ready = false
        this.client = conf.client
        this.db = conf.db
        this.config = conf.config
        this.system = new System(this)
        this.me = this.client.user
        this.users = new _UserManager(this)
        this.guilds = new _GuildManager(this)
        this.notifiers = new _NotifierManager(this)
        this.messages = new _MessageManager(this)
        this.express = express()
        this.events = new EventManager(this)
        this.sessions = new Map
        this.init()
    }

    async init() {
        console.log(cmd.Yellow, 'Amateras System Initialization...')
        // bot _user object create
        await this.users.fetch(this.me)
        // fetch all guild
        await this.guilds.init()
        // init all events
        await this.events.init()
        // init system
        await this.system.init()
        // start handle commands
        this.eventHandler()
        this.ready = true
        await this.onready()
        console.log(cmd.Yellow, 'Amateras Ready.')
        this.serverHandler()
        
        test(this)
    }

    private async onready() {
        for (const notifier of this.notifiers.cache.values()) {
            notifier.start()
        }
    }

    private eventHandler() {
        const eventFiles = fs.readdirSync('./js/events').filter(file => file.endsWith('.js'));

        for (const file of eventFiles) {
            const event = require(`../events/${file}`);
            if (event.once) {
                this.client.once(event.name, (...args) => event.execute(...args, this));
            } else {
                this.client.on(event.name, (...args) => event.execute(...args, this));
            }
        }
    }

    private serverHandler() {
        this.express.use(express.json())
        this.express.use(express.urlencoded({ extended: true }))
        
        this.express.get('/file/*', (req, res) => {
            if (process.platform === 'win32') {
                res.send(global.path + req.originalUrl.slice(6).replace('/', '\\'))
            } else res.send(global.path + req.originalUrl.slice(6))
        })

        this.express.post('/login', async (req,res) => {
            const data = req.body as ConsoleLoginInfo
            const userData = await this.system.console.getUser(data.username)
            if (!userData) return res.send('User not exist')
            if (userData.password !== data.password) return res.send('Wrong password')
            this.sessions.set(data.sessionID, userData)
            res.send('Login successful')
        })

        this.express.post('/session', async (req, res) => {
            const data = req.body as { sessionID: string }
            const get = this.sessions.get(data.sessionID)
            if (!get) res.send(false)
            else res.send(true)
        })

        this.express.post('/console', async (req, res) => {
            const data = req.body as ConsoleData
            const _guild = this.guilds.cache.get(data.guild)
            if (!_guild) return
            const _channel = _guild.channels.cache.get(data.channel)
            if (!_channel || !_channel.isTextBased()) return

            if (data.reply) {
                const regexArr = data.reply.match(/[0-9]\d+/g)
                const replyId = regexArr ? regexArr[2] : undefined
                if (!replyId) return
                const message = await _channel.origin.messages.fetch(replyId).catch(() => undefined)
                if (!message) return
                await message.reply({
                    content: data.content
                })
            } else await _channel.origin.send(data.content)
            res.send('Send')
        })

        this.express.get('/console-data', async (req, res) => {
            const sessionID = req.query.sessionID as string
            const get = this.sessions.get(sessionID)
            if (!get) return res.send({ success: false, message: 'session error' })
            if (get.role === 'admin') {
                const data: any = { guilds: [], success: true }
                for (const _guild of this.guilds.cache.values()) {
                    const guildData = {
                        id: _guild.id,
                        name: _guild.name,
                        categories: _guild.channels.categories,
                        channels: _guild.channels.textChannels
                    }
                    data.guilds.push(guildData)
                }
                res.send(data)
            } else {
                const _guild = this.guilds.cache.get('744127668064092160')
                if (!_guild) return res.send({ success: false, message: 'guild cache error' })
                const limitAccess = await this.system.console.getLimitAccess()
                if (!limitAccess) return res.send({ success: false, message: 'limit error' })
                const data = {
                    guilds: [
                        {
                            id: _guild.id,
                            name: _guild.name,
                            categories: _guild.channels.listCategories(limitAccess.categories),
                            channels: _guild.channels.listTextChannels(limitAccess.channels)
                        }
                    ]
                }
                res.send(data)
            }
        })

        this.express.get('/console-data/:guildId/:channelId/messages', (req, res) => {
            const data: {[key: string]: any, messages: ConsoleMessageOption[]} = { channel: req.params.channelId, guild: req.params.guildId, messages: [] }
            const _guild = this.guilds.cache.get(data.guild)
            if (!_guild) return
            const _channel = _guild.channels.cache.get(data.channel)
            if (!_channel || !_channel.isTextBased()) return
            for (const message of _channel.origin.messages.cache.values()) {
                const attachments = Array.from(message.attachments.values())
                const attachmentsData = []
                for (const attachment of attachments) {
                    attachmentsData.push({
                        type: attachment.contentType,
                        url: attachment.url
                    })
                }
                if (!message.author) continue
                const member = _guild.origin.members.cache.get(message.author.id)
                const sticker = message.stickers.first()
                // mention replace
                const usermentions = message.content.match(/(<@)[0-9]\d+(>)/)
                if (usermentions) {
                    for (const usermention of usermentions) {
                        const mentionMember = _guild.origin.members.cache.get(usermention.slice(2, usermention.length - 1))
                        if (!mentionMember) continue
                        message.content = message.content.replace(usermention, ` @${mentionMember.displayName} `)
                    }
                }
                // channel replace
                const channelTags = message.content.match(/(<#)[0-9]\d+(>)/)
                if (channelTags) {
                    for (const channelTag of channelTags) {
                        const channel = _guild.origin.channels.cache.get(channelTag.slice(2, channelTag.length - 1))
                        if (!channel) continue
                        message.content = message.content.replace(channelTag, ` @${channel.name} `)
                    }
                }
                // embed
                data.messages.push({
                    id: message.id,
                    content: message.content,
                    author: {
                        name: member ? member.nickname ? member.displayName : message.author.username : message.author.username,
                        id: message.author.id,
                        avatar: member ? member.displayAvatarURL({format: 'png', size: 128}) : message.author.displayAvatarURL({format: 'png', size: 128})
                    },
                    timestamps: message.createdTimestamp,
                    url: message.url,
                    sticker: sticker ? sticker.name : undefined,
                    attachments: attachmentsData,
                    embeds: Array.from(message.embeds.map((embed) => embed.toJSON()))
                })
            }
            res.send(data)
        })

        this.express.listen(30, () => console.log('Port 30 listening.'))
    }
}

export interface AmaterasConfig {
    client: Client<true>,
    db: Db,
    config: {}
}

export interface Session {
    sessionID: string
}