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
const test_1 = __importDefault(require("../etc/test"));
const _EventManager_1 = require("./_EventManager");
const _Server_js_1 = require("./_Server.js");
const _DownloadManager_js_1 = require("./_DownloadManager.js");
class Amateras {
    constructor(conf) {
        this.ready = false;
        this.client = conf.client;
        this.db = conf.db;
        this.config = conf.config;
        this.system = new System_1.System(this);
        this.download = new _DownloadManager_js_1._DownloadManager(this);
        this.me = this.client.user;
        this.users = new _UserManager_1._UserManager(this);
        this.guilds = new _GuildManager_1._GuildManager(this);
        this.notifiers = new _NotifierManager_1._NotifierManager(this);
        this.messages = new _MessageManager_1._MessageManager(this);
        this.events = new _EventManager_1.EventManager(this);
        this.server = new _Server_js_1._Server(this);
        this.init();
        this.log = this.system.logs.log.bind(this.system.logs);
        this.error = this.system.logs.error.bind(this.system.logs);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(cmd_1.default.Yellow, 'Amateras System Initialization...');
            // bot _user object create
            yield this.users.fetch(this.me);
            // init system
            yield this.system.init();
            // fetch all guild
            yield this.guilds.init();
            // init all events
            yield this.events.init();
            // init server
            yield this.server.init();
            // start handle commands
            this.eventHandler();
            this.ready = true;
            yield this.onready();
            console.log(cmd_1.default.Yellow, 'Amateras Ready.');
            this.log('Amateras start.');
            (0, test_1.default)(this);
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
}
exports.Amateras = Amateras;
//# sourceMappingURL=Amateras.js.map