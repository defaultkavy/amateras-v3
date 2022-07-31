"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __GuildCommandManager_commands;
Object.defineProperty(exports, "__esModule", { value: true });
exports._GuildCommandManager = void 0;
const _GuildCommand_1 = require("./_GuildCommand");
const { deploy, commands } = require('../../commands.json');
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const _BaseGuildManagerDB_1 = require("./_BaseGuildManagerDB");
class _GuildCommandManager extends _BaseGuildManagerDB_1._BaseGuildManagerDB {
    constructor(_guild, info) {
        super(_guild.amateras, _guild, _guild.amateras.db.collection('guild_commands'));
        __GuildCommandManager_commands.set(this, void 0);
        __classPrivateFieldSet(this, __GuildCommandManager_commands, info.commands, "f");
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (deploy) {
                const commandList = [];
                if (!this.amateras.system.isReady())
                    throw new Error('System is not ready');
                const rows = yield this.amateras.system.sheets.command_access.getRows();
                const row = rows.find(row => row.guildId = this._guild.id);
                for (const command of commands) {
                    if (command.default_deploy) {
                        commandList.push(command);
                    }
                    else {
                        if (!row)
                            continue;
                        if (row[command.name] === 'TRUE')
                            commandList.push(command);
                    }
                }
                console.time('| Commands Deployed');
                yield this.deployCommand(commandList);
                console.timeEnd('| Commands Deployed');
            }
            else
                console.log('| Commands Deploy Disabled');
            const data = yield this.collection.find().filter({ guildId: this._guild.id }).toArray();
            for (const command of (yield this._guild.origin.commands.fetch()).values()) {
                const db = data.find((obj) => obj.id === command.id);
                const _guildCommand = new _GuildCommand_1._GuildCommand(this.amateras, this._guild, {
                    id: command.id,
                    name: command.name,
                    limitedChannels: db ? db.limitedChannels ? db.limitedChannels : [] : []
                });
                this.cache.set(_guildCommand.id, _guildCommand);
                _guildCommand.save();
            }
        });
    }
    deployCommand(commands) {
        return __awaiter(this, void 0, void 0, function* () {
            const rest = new rest_1.REST({ version: '9' }).setToken(this.amateras.client.token);
            try {
                yield rest.put(v9_1.Routes.applicationGuildCommands(this.amateras.me.id, this._guild.id), { body: commands });
            }
            catch (err) {
                console.error(err);
            }
        });
    }
}
exports._GuildCommandManager = _GuildCommandManager;
__GuildCommandManager_commands = new WeakMap();
//# sourceMappingURL=_GuildCommandManager.js.map