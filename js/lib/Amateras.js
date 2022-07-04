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
const test_1 = __importDefault(require("../etc/test"));
const _EventManager_1 = require("./_EventManager");
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
        this.events = new _EventManager_1.EventManager(this);
        this.sessions = new Map;
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(cmd_1.default.Yellow, 'Amateras System Initialization...');
            // bot _user object create
            yield this.users.fetch(this.me);
            // fetch all guild
            yield this.guilds.init();
            // init all events
            yield this.events.init();
            // init system
            yield this.system.init();
            // start handle commands
            this.eventHandler();
            this.ready = true;
            yield this.onready();
            console.log(cmd_1.default.Yellow, 'Amateras Ready.');
            this.serverHandler();
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
    serverHandler() {
        this.express.use(express_1.default.json());
        this.express.use(express_1.default.urlencoded({ extended: true }));
        this.express.get('/file/*', (req, res) => {
            if (process.platform === 'win32') {
                res.send(global.path + req.originalUrl.slice(6).replace('/', '\\'));
            }
            else
                res.send(global.path + req.originalUrl.slice(6));
        });
        this.express.post('/login', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = req.body;
            const userData = yield this.system.console.getUser(data.username);
            if (!userData)
                return res.send('User not exist');
            if (userData.password !== data.password)
                return res.send('Wrong password');
            this.sessions.set(data.sessionID, userData);
            res.send('Login successful');
        }));
        this.express.post('/session', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = req.body;
            const get = this.sessions.get(data.sessionID);
            if (!get)
                res.send(false);
            else
                res.send(true);
        }));
        this.express.post('/console', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = req.body;
            const _guild = this.guilds.cache.get(data.guild);
            if (!_guild)
                return;
            const _channel = _guild.channels.cache.get(data.channel);
            if (!_channel || !_channel.isTextBased())
                return;
            if (data.reply) {
                const regexArr = data.reply.match(/[0-9]\d+/g);
                const replyId = regexArr ? regexArr[2] : undefined;
                if (!replyId)
                    return;
                const message = yield _channel.origin.messages.fetch(replyId).catch(() => undefined);
                if (!message)
                    return;
                yield message.reply({
                    content: data.content
                });
            }
            else
                yield _channel.origin.send(data.content);
            res.send('Send');
        }));
        this.express.get('/console-data', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const sessionID = req.query.sessionID;
            const get = this.sessions.get(sessionID);
            if (!get)
                return res.send({ success: false, message: 'session error' });
            if (get.role === 'admin') {
                const data = { guilds: [], success: true };
                for (const _guild of this.guilds.cache.values()) {
                    const guildData = {
                        id: _guild.id,
                        name: _guild.name,
                        categories: _guild.channels.categories,
                        channels: _guild.channels.textChannels
                    };
                    data.guilds.push(guildData);
                }
                res.send(data);
            }
            else {
                const _guild = this.guilds.cache.get('744127668064092160');
                if (!_guild)
                    return res.send({ success: false, message: 'guild cache error' });
                const limitAccess = yield this.system.console.getLimitAccess();
                if (!limitAccess)
                    return res.send({ success: false, message: 'limit error' });
                const data = {
                    guilds: [
                        {
                            id: _guild.id,
                            name: _guild.name,
                            categories: _guild.channels.listCategories(limitAccess.categories),
                            channels: _guild.channels.listTextChannels(limitAccess.channels)
                        }
                    ]
                };
                res.send(data);
            }
        }));
        this.express.get('/console-data/:guildId/:channelId/messages', (req, res) => {
            const data = { channel: req.params.channelId, guild: req.params.guildId, messages: [] };
            const _guild = this.guilds.cache.get(data.guild);
            if (!_guild)
                return;
            const _channel = _guild.channels.cache.get(data.channel);
            if (!_channel || !_channel.isTextBased())
                return;
            for (const message of _channel.origin.messages.cache.values()) {
                const attachments = Array.from(message.attachments.values());
                const attachmentsData = [];
                for (const attachment of attachments) {
                    attachmentsData.push({
                        type: attachment.contentType,
                        url: attachment.url
                    });
                }
                if (!message.author)
                    continue;
                const member = _guild.origin.members.cache.get(message.author.id);
                const sticker = message.stickers.first();
                // mention replace
                const usermentions = message.content.match(/(<@)[0-9]\d+(>)/);
                if (usermentions) {
                    for (const usermention of usermentions) {
                        const mentionMember = _guild.origin.members.cache.get(usermention.slice(2, usermention.length - 1));
                        if (!mentionMember)
                            continue;
                        message.content = message.content.replace(usermention, ` @${mentionMember.displayName} `);
                    }
                }
                // channel replace
                const channelTags = message.content.match(/(<#)[0-9]\d+(>)/);
                if (channelTags) {
                    for (const channelTag of channelTags) {
                        const channel = _guild.origin.channels.cache.get(channelTag.slice(2, channelTag.length - 1));
                        if (!channel)
                            continue;
                        message.content = message.content.replace(channelTag, ` @${channel.name} `);
                    }
                }
                // embed
                data.messages.push({
                    id: message.id,
                    content: message.content,
                    author: {
                        name: member ? member.nickname ? member.displayName : message.author.username : message.author.username,
                        id: message.author.id,
                        avatar: member ? member.displayAvatarURL({ format: 'png', size: 128 }) : message.author.displayAvatarURL({ format: 'png', size: 128 })
                    },
                    timestamps: message.createdTimestamp,
                    url: message.url,
                    sticker: sticker ? sticker.name : undefined,
                    attachments: attachmentsData,
                    embeds: Array.from(message.embeds.map((embed) => embed.toJSON()))
                });
            }
            res.send(data);
        });
        this.express.listen(30, () => console.log('Port 30 listening.'));
    }
}
exports.Amateras = Amateras;
//# sourceMappingURL=Amateras.js.map