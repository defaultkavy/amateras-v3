import { Guild } from "discord.js";
import { Amateras } from "./Amateras";
import { _Base } from "./_Base";
import { _BaseObj } from "./_BaseObj";
import { _GuildChannelManager } from "./_GuildChannelManager";
import { _GuildNotifierManager } from "./_GuildNotifierManager";
import cmd from "../plugins/cmd";
import { _GuildCommandManager } from "./_GuildCommandManager";

export class _Guild extends _BaseObj {
    origin: Guild;
    name: string;
    channels: _GuildChannelManager;
    notifiers: _GuildNotifierManager;
    commands: _GuildCommandManager;
    constructor(amateras: Amateras, guild: Guild, info: _GuildInfo) {
        super(amateras, info, amateras.guilds.collection, ['channels', 'notifiers', 'commands'])
        this.origin = guild
        this.name = guild.name
        this.channels = new _GuildChannelManager(amateras, this, {hints: info.hints})
        this.notifiers = new _GuildNotifierManager(amateras, this, {list: info.notifiers})
        this.commands = new _GuildCommandManager(this, {commands: info.commands})
    }

    async init() {
        console.log(cmd.Green, `Initializing Guild: ${this.name}`)
        console.time('| Member Fetched')
        await this.origin.members.fetch()
        console.timeEnd('| Member Fetched')
        await this.commands.init()
        console.time('| Channels Initialized')
        await this.channels.init()
        console.timeEnd('| Channels Initialized')
        console.time('| Notifiers Initialized')
        await this.notifiers.init()
        console.timeEnd('| Notifiers Initialized')
    }

    async presave() {
        return {
            notifiers: this.notifiers.list,
            hints: this.channels.hintChannels
        }
    }
}

export interface _GuildDB {
    id: string;
    name?: string;
    notifiers?: string[]
    hints?: string[]
    commands?: string[]
}

export interface _GuildInfo {
    id: string;
    name: string;
    notifiers: string[]
    hints: string[]
    commands: string[]
}