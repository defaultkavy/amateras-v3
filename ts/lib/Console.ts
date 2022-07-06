import { APIEmbed } from "discord-api-types/v9.js";
import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { Amateras, Session } from "./Amateras.js";
import { _Base } from "./_Base.js";
import { Express } from 'express'

export class Console extends _Base {
    sheets: GoogleSpreadsheet["sheetsByTitle"] | undefined;
    constructor(amateras: Amateras) {
        super(amateras)
    }
    
    async init() {
        const spreadsheets = new GoogleSpreadsheet('18tQ8_l5tAwCoCFz1O0GvYeuqmTYq4V_DB7r3l01XHeI')
        await spreadsheets.useServiceAccountAuth(this.amateras.system.cert)
        await spreadsheets.loadInfo()
        this.sheets = spreadsheets.sheetsByTitle
    }

    async getUser(id: string) {
        if (!this.sheets) return
        const sheet = this.sheets['Console']
        const rows = await sheet.getRows()
        const headers = sheet.headerValues
        const arr: ConsoleDB[] = []
        for (let i = 0; i < rows.length; i++) {
            const obj: {[key: string]: any} = {}
            for (const header of headers) {
                obj[header] = rows[i][header]
            }
            arr.push(obj as ConsoleDB)
        }
        const user = arr.find((value) => value.username === id)
        return user
    }

    async getLimitAccess() {
        if (!this.sheets) return
        const sheet = this.sheets['ConsoleUserAccessLimit']
        const rows = (await sheet.getRows()) as []
        const headers = sheet.headerValues as ['channels', 'guilds']
        const data = {
            channels: [],
            guilds: []
        }
        for (const header of headers) {
            for (const row of rows) {
                data[header].push(row[header])
            }
        }
        return data as limitAccessData
    }

    async login(express: Express) {
        express.post('/login', async (req, res) => {
            const data = req.body as ConsoleLoginInfo
            const userData = await this.getUser(data.username)
            if (!userData) return res.send('User not exist')
            if (userData.password !== data.password) return res.send('Wrong password')
            this.amateras.server.sessions.set(data.sessionID, userData)
            res.send('Login successful')
        })
    }

    async post(express: Express) {
        express.post('/console', async (req, res) => {
            const data = req.body as ConsoleOptions
            const _guild = this.amateras.guilds.cache.get(data.guild)
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
    }

    async get(express: Express) {
        express.get('/console', async (req, res) => {
            const sessionID = req.query.sessionID as string
            const get = this.amateras.server.sessions.get(sessionID)
            
            if (!get) return res.send({ success: false, message: 'session error' })
                const data: ConsoleData = { guilds: [], success: true }
                
                if (get.role === 'admin') {
                    for (const _guild of this.amateras.guilds.cache.values()) {
                        const guildData = {
                            id: _guild.id,
                            access: true,
                            name: _guild.name,
                            categories: _guild.channels.consoleCategories(),
                            channels: _guild.channels.consoleTextChannels([], get.role),
                            emojis: Array.from(_guild.origin.emojis.cache.values()).map(emoji => ({
                                id: emoji.id,
                                url: emoji.url,
                                name: emoji.name
                            })),
                            members: Array.from(_guild.origin.members.cache.values()).map(member => ({
                                id: member.id,
                                name: member.nickname ? member.nickname : member.displayName
                            })),
                            roles: Array.from(_guild.origin.roles.cache.values()).map(role => ({
                                id: role.id,
                                name: role.name
                            })),
                        }
                        data.guilds.push(guildData)
                    }
                } else if (get.role === 'user') {
                    const limitAccess = await this.getLimitAccess()
                    if (!limitAccess) return res.send({ success: false, message: 'limit error' })
                    for (const _guild of this.amateras.guilds.cache.values()) {
                        if (!limitAccess.guilds.includes(_guild.id)) continue
                        const guildData = {
                            id: _guild.id,
                            access: limitAccess.guilds.includes(_guild.id) ? true : false,
                            name: _guild.name,
                            categories: _guild.channels.consoleCategories(),
                            channels: _guild.channels.consoleTextChannels(limitAccess.channels, get.role),
                            emojis: Array.from(_guild.origin.emojis.cache.values()).map(emoji => ({
                                id: emoji.id,
                                url: emoji.url,
                                name: emoji.name
                            })),
                            members: Array.from(_guild.origin.members.cache.values()).map(member => ({
                                id: member.id,
                                name: member.nickname ? member.nickname : member.displayName
                            })),
                            roles: Array.from(_guild.origin.roles.cache.values()).map(role => ({
                                id: role.id,
                                name: role.name
                            })),
                        }
                        data.guilds.push(guildData)
                    }
                }
                res.send(data)
            })
    }

    async getMessages(express: Express) {
        express.get('/console-data/:guildId/:channelId/messages', (req, res) => {
            const data: {[key: string]: any, messages: ConsoleMessageOption[]} = { channel: req.params.channelId, guild: req.params.guildId, messages: [] }
            const _guild = this.amateras.guilds.cache.get(data.guild)
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
    }
}

export interface ConsoleDB {
    username: string,
    password: string,
    role: ConsoleRole
}

export type ConsoleRole = 'admin' | 'user'

export interface ConsoleLoginInfo extends Session {
    username: string,
    password: string
}

export interface ConsoleData {
    guilds: ConsoleGuildData[],
    success: boolean
}

export interface ConsoleGuildData {
    id: string,
    name: string,
    categories: ConsoleCategoryData[],
    channels: ConsoleChannelData[],
    access: boolean,
    emojis: ConsoleEmojiData[],
    members: ConsoleMemberData[],
    roles: ConsoleRoleData[]
}

export interface ConsoleCategoryData {
    id: string,
    name: string,
    position: number
}

export interface ConsoleChannelData {
    id: string,
    name: string,
    position: number | undefined,
    parent: string | null,
    access: boolean
}

export interface ConsoleEmojiData {
    id: string,
    name: string | null,
    url: string
}

export interface ConsoleMemberData {
    id: string,
    name: string
}

export interface ConsoleRoleData {
    id: string,
    name: string
}

export interface ConsoleOptions {
    guild: string,
    channel: string,
    content: string,
    reply: string | undefined
}

export interface ConsoleMessageOption {
    id: string,
    content: string,
    author: { name: string, id: string, avatar: string},
    timestamps: number,
    url: string,
    sticker: string | undefined,
    attachments: { type: string | null, url: string }[],
    embeds: APIEmbed[]
}

export interface limitAccessData {
    channels: string[],
    guilds: string[]
}