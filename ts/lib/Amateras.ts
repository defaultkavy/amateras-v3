import { Client, User } from "discord.js";
import { Db } from "mongodb";
import cmd from "../plugins/cmd";
import { _GuildManager } from "./_GuildManager";
import { _UserManager } from "./_UserManager";
import fs from 'fs'
import { System } from "./System";
import { _NotifierManager } from "./_NotifierManager";
import { _MessageManager } from "./_MessageManager";
import express, { Express } from 'express'

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
        this.init()
    }

    async init() {
        console.log(cmd.Yellow, 'Amateras System Initialization...')
        // bot _user object create
        await this.users.fetch(this.me)
        // fetch all guild
        await this.guilds.init()
        // start handle commands
        this.eventHandler()
        this.ready = true
        await this.onready()
        console.log(cmd.Yellow, 'Amateras Ready.')
        this.serverHandler()
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
        this.express.get('/ko-fi', (res) => {
            console.debug(res)
        })

        this.express.listen(30, () => console.log('Port 30 listening.'))
    }
}

export interface AmaterasConfig {
    client: Client<true>,
    db: Db,
    config: {}
}