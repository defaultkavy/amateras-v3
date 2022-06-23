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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._Guild = void 0;
const _BaseObj_1 = require("./_BaseObj");
const _GuildChannelManager_1 = require("./_GuildChannelManager");
const _GuildNotifierManager_1 = require("./_GuildNotifierManager");
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const cmd_1 = __importDefault(require("../plugins/cmd"));
const { commands } = require('../../commands.json');
class _Guild extends _BaseObj_1._BaseObj {
    constructor(amateras, guild, info) {
        super(amateras, info, amateras.guilds.collection, ['channels', 'notifiers']);
        this.origin = guild;
        this.name = guild.name;
        this.channels = new _GuildChannelManager_1._GuildChannelManager(amateras, this);
        this.notifiers = new _GuildNotifierManager_1._GuildNotifierManager(amateras, this, { list: info.notifiers });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(cmd_1.default.Green, 'Guild Commands Deploy...');
            console.time('| Commands Deployed');
            //await this.deployCommand()
            console.timeEnd('| Commands Deployed');
            console.time('| Channels Initialized');
            yield this.channels.init();
            console.timeEnd('| Channels Initialized');
            console.time('| Notifiers Initialized');
            yield this.notifiers.init();
            console.timeEnd('| Notifiers Initialized');
        });
    }
    deployCommand() {
        return __awaiter(this, void 0, void 0, function* () {
            const rest = new rest_1.REST({ version: '9' }).setToken(this.amateras.client.token);
            try {
                yield rest.put(v9_1.Routes.applicationGuildCommands(this.amateras.me.id, this.id), { body: commands });
            }
            catch (err) {
                console.error(err);
            }
        });
    }
    presave() {
        return {
            notifiers: this.notifiers.list
        };
    }
}
exports._Guild = _Guild;
//# sourceMappingURL=_Guild.js.map