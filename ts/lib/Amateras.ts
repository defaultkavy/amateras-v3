import { Client, User } from "discord.js";
import { Db } from "mongodb";
import cmd from "../plugins/cmd";
import { _GuildManager } from "./_GuildManager";
import { _UserManager } from "./_UserManager";
import fs from 'fs'
import { System } from "./System";
import { _NotifierManager } from "./_NotifierManager";
import { _MessageManager } from "./_MessageManager";
import test from '../etc/test'
import { EventManager } from "./_EventManager";
import { _Server } from "./_Server.js";
import { _DownloadManager } from "./_DownloadManager.js";
import { _Log } from "./_Log";

export class Amateras {
    client: Client<true>;
    db: Db;
    me: User;
    users: _UserManager;
    guilds: _GuildManager;
    config: Config;
    system: System;
    notifiers: _NotifierManager;
    messages: _MessageManager;
    ready: boolean;
    events: EventManager;
    server: _Server;
    download: _DownloadManager;
    log: (content: string) => Promise<void>;
    error: (content: string) => Promise<void>;
    constructor(conf: AmaterasConfig) {
        this.ready = false
        this.client = conf.client
        this.db = conf.db
        this.config = conf.config
        this.system = new System(this)
        this.download = new _DownloadManager(this)
        this.me = this.client.user
        this.users = new _UserManager(this)
        this.guilds = new _GuildManager(this)
        this.notifiers = new _NotifierManager(this)
        this.messages = new _MessageManager(this)
        this.events = new EventManager(this)
        this.server = new _Server(this)
        this.init()

        this.log = this.system.logs.log.bind(this.system.logs)
        this.error = this.system.logs.error.bind(this.system.logs)
    }

    async init() {
        console.log(cmd.Yellow, 'Amateras System Initialization...')
        // bot _user object create
        await this.users.fetch(this.me)
        // init system
        await this.system.init()
        // fetch all guild
        await this.guilds.init()
        // init all events
        await this.events.init()
        // init server
        await this.server.init()
        // start handle commands
        this.eventHandler()
        this.ready = true
        await this.onready()
        console.log(cmd.Yellow, 'Amateras Ready.')
        this.log('Amateras start.')
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
}

export interface AmaterasConfig {
    client: Client<true>,
    db: Db,
    config: Config
}

export interface Config {
    bot: {
        token: string
    }
    server: {
        host: string
    }
    sheets: {
        system: string
    }
}

export interface Session {
    sessionID: string
}