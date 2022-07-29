import { _BaseGuildManager } from "./_BaseGuildManager";
import { _Guild } from "./_Guild";
import { _GuildCommand, _GuildCommandDB, _GuildCommandInfo } from "./_GuildCommand";
const { deploy, commands } = require('../../commands.json')
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { _BaseGuildManagerDB } from "./_BaseGuildManagerDB";

export class _GuildCommandManager extends _BaseGuildManagerDB<_GuildCommand, _GuildCommandDB> {
    #commands: string[];
    constructor(_guild: _Guild, info: _GuildCommandManagerInfo) {
        super(_guild.amateras, _guild, _guild.amateras.db.collection('guild_commands'))
        this.#commands = info.commands
    }

    async init() {

        if (deploy) {
            const commandList = []
            for (const command of commands) {
                if (command.default_deploy) {
                    commandList.push(command)
                } else {
                    if (!this.amateras.system.isReady()) throw new Error('System is not ready')
                    const rows = await this.amateras.system.sheets.command_access.getRows()
                    const row = rows.find(row => row.guildId = this._guild.id)
                    if (!row) continue
                    if (row[command] === 'TRUE') commandList.push(command)
                }
            }
            console.time('| Commands Deployed')
            await this.deployCommand(commandList)
            console.timeEnd('| Commands Deployed')
        } else console.log('| Commands Deploy Disabled')

        const data = await this.collection.find().filter({guildId: this._guild.id}).toArray()

        for (const command of (await this._guild.origin.commands.fetch()).values()) {
            const db = data.find((obj) => obj.id === command.id)
            const _guildCommand = new _GuildCommand(this.amateras, this._guild, {
                id: command.id,
                name: command.name,
                limitedChannels: db ? db.limitedChannels ? db.limitedChannels : [] : []
            })
            this.cache.set(_guildCommand.id, _guildCommand)
            _guildCommand.save()
        }
    }

    async deployCommand(commands: any[]) {
        const rest = new REST({ version: '9' }).setToken(this.amateras.client.token!);

        try {
            await rest.put(
                Routes.applicationGuildCommands(this.amateras.me.id, this._guild.id),
                { body: commands },
            );
        } catch(err) {
            console.error(err);
        }
    }
}

export interface _GuildCommandManagerInfo {
    commands: string[]
}