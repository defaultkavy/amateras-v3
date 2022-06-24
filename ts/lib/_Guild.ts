import { Guild } from "discord.js";
import { Amateras } from "./Amateras";
import { _Base } from "./_Base";
import { _BaseObj } from "./_BaseObj";
import { _GuildChannelManager } from "./_GuildChannelManager";
import { _GuildNotifierManager } from "./_GuildNotifierManager";
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import cmd from "../plugins/cmd";
const { deploy, commands } = require('../../commands.json')

export class _Guild extends _BaseObj {
    origin: Guild;
    name: string;
    channels: _GuildChannelManager;
    notifiers: _GuildNotifierManager;
    constructor(amateras: Amateras, guild: Guild, info: _GuildInfo) {
        super(amateras, info, amateras.guilds.collection, ['channels', 'notifiers'])
        this.origin = guild
        this.name = guild.name
        this.channels = new _GuildChannelManager(amateras, this, {hints: info.hints})
        this.notifiers = new _GuildNotifierManager(amateras, this, {list: info.notifiers})
    }

    async init() {
        console.log(cmd.Green, 'Guild Commands Deploy...')
        if (deploy) {
            console.time('| Commands Deployed')
            await this.deployCommand()
            console.timeEnd('| Commands Deployed')
        } else console.log('| Commands Deploy Disabled')
        console.time('| Channels Initialized')
        await this.channels.init()
        console.timeEnd('| Channels Initialized')
        console.time('| Notifiers Initialized')
        await this.notifiers.init()
        console.timeEnd('| Notifiers Initialized')
    }

    async deployCommand() {
        const rest = new REST({ version: '9' }).setToken(this.amateras.client.token!);

        try {
            await rest.put(
                Routes.applicationGuildCommands(this.amateras.me.id, this.id),
                { body: commands },
            );
        } catch(err) {
            console.error(err);
        }
    }

    presave() {
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
}

export interface _GuildInfo {
    id: string;
    name: string;
    notifiers: string[]
    hints: string[]
}