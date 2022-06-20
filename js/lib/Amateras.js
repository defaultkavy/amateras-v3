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
exports.Amateras = void 0;
const cmd_1 = __importDefault(require("../plugins/cmd"));
const _GuildManager_1 = require("./_GuildManager");
const _UserManager_1 = require("./_UserManager");
const fs_1 = __importDefault(require("fs"));
const System_1 = require("./System");
const _NotifierManager_1 = require("./_NotifierManager");
const _MessageManager_1 = require("./_MessageManager");
const express_1 = __importDefault(require("express"));
class Amateras {
    constructor(conf) {
        this.ready = false;
        this.client = conf.client;
        this.db = conf.db;
        this.config = conf.config;
        this.system = new System_1.System(this);
        this.me = this.client.user;
        this.users = new _UserManager_1._UserManager(this);
        this.guilds = new _GuildManager_1._GuildManager(this);
        this.notifiers = new _NotifierManager_1._NotifierManager(this);
        this.messages = new _MessageManager_1._MessageManager(this);
        this.express = (0, express_1.default)();
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(cmd_1.default.Yellow, 'Amateras System Initialization...');
            // bot _user object create
            yield this.users.fetch(this.me);
            // fetch all guild
            yield this.guilds.init();
            // start handle commands
            this.eventHandler();
            this.ready = true;
            yield this.onready();
            console.log(cmd_1.default.Yellow, 'Amateras Ready.');
            this.serverHandler();
        });
    }
    onready() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const notifier of this.notifiers.cache.values()) {
                notifier.start();
            }
        });
    }
    eventHandler() {
        const eventFiles = fs_1.default.readdirSync('./js/events').filter(file => file.endsWith('.js'));
        for (const file of eventFiles) {
            const event = require(`../events/${file}`);
            if (event.once) {
                this.client.once(event.name, (...args) => event.execute(...args, this));
            }
            else {
                this.client.on(event.name, (...args) => event.execute(...args, this));
            }
        }
    }
    serverHandler() {
        this.express.post('/ko-fi', (req, res) => {
            console.debug(req);
            console.debug(req.body);
        });
        this.express.listen(30, () => console.log('Port 30 listening.'));
    }
}
exports.Amateras = Amateras;
//# sourceMappingURL=Amateras.js.map