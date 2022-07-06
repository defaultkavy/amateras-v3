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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Console = void 0;
const google_spreadsheet_1 = require("google-spreadsheet");
const _Base_js_1 = require("./_Base.js");
class Console extends _Base_js_1._Base {
    constructor(amateras) {
        super(amateras);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const spreadsheets = new google_spreadsheet_1.GoogleSpreadsheet('18tQ8_l5tAwCoCFz1O0GvYeuqmTYq4V_DB7r3l01XHeI');
            yield spreadsheets.useServiceAccountAuth(this.amateras.system.cert);
            yield spreadsheets.loadInfo();
            this.sheets = spreadsheets.sheetsByTitle;
        });
    }
    getUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.sheets)
                return;
            const sheet = this.sheets['Console'];
            const rows = yield sheet.getRows();
            const headers = sheet.headerValues;
            const arr = [];
            for (let i = 0; i < rows.length; i++) {
                const obj = {};
                for (const header of headers) {
                    obj[header] = rows[i][header];
                }
                arr.push(obj);
            }
            const user = arr.find((value) => value.username === id);
            return user;
        });
    }
    getLimitAccess() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.sheets)
                return;
            const sheet = this.sheets['ConsoleUserAccessLimit'];
            const rows = (yield sheet.getRows());
            const headers = sheet.headerValues;
            const data = {
                channels: [],
                guilds: []
            };
            for (const header of headers) {
                for (const row of rows) {
                    data[header].push(row[header]);
                }
            }
            return data;
        });
    }
    login(express) {
        return __awaiter(this, void 0, void 0, function* () {
            express.post('/login', (req, res) => __awaiter(this, void 0, void 0, function* () {
                const data = req.body;
                const userData = yield this.getUser(data.username);
                if (!userData)
                    return res.send('User not exist');
                if (userData.password !== data.password)
                    return res.send('Wrong password');
                this.amateras.server.sessions.set(data.sessionID, userData);
                res.send('Login successful');
            }));
        });
    }
    post(express) {
        return __awaiter(this, void 0, void 0, function* () {
            express.post('/console', (req, res) => __awaiter(this, void 0, void 0, function* () {
                const data = req.body;
                const _guild = this.amateras.guilds.cache.get(data.guild);
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
        });
    }
    get(express) {
        return __awaiter(this, void 0, void 0, function* () {
            express.get('/console', (req, res) => __awaiter(this, void 0, void 0, function* () {
                const sessionID = req.query.sessionID;
                const get = this.amateras.server.sessions.get(sessionID);
                if (!get)
                    return res.send({ success: false, message: 'session error' });
                const data = { guilds: [], success: true };
                if (get.role === 'admin') {
                    for (const _guild of this.amateras.guilds.cache.values()) {
                        const guildData = {
                            id: _guild.id,
                            access: true,
                            name: _guild.name,
                            categories: _guild.channels.consoleCategories(),
                            channels: _guild.channels.consoleTextChannels([], get.role),
                            emojis: Array.from(_guild.origin.emojis.cache.values()).map(emoji => ({
                                id: emoji.id,
                                url: emoji.url,
                                name: emoji.name
                            })),
                            members: Array.from(_guild.origin.members.cache.values()).map(member => ({
                                id: member.id,
                                name: member.nickname ? member.nickname : member.displayName
                            })),
                            roles: Array.from(_guild.origin.roles.cache.values()).map(role => ({
                                id: role.id,
                                name: role.name
                            })),
                        };
                        data.guilds.push(guildData);
                    }
                }
                else if (get.role === 'user') {
                    const limitAccess = yield this.getLimitAccess();
                    if (!limitAccess)
                        return res.send({ success: false, message: 'limit error' });
                    for (const _guild of this.amateras.guilds.cache.values()) {
                        if (!limitAccess.guilds.includes(_guild.id))
                            continue;
                        const guildData = {
                            id: _guild.id,
                            access: limitAccess.guilds.includes(_guild.id) ? true : false,
                            name: _guild.name,
                            categories: _guild.channels.consoleCategories(),
                            channels: _guild.channels.consoleTextChannels(limitAccess.channels, get.role),
                            emojis: Array.from(_guild.origin.emojis.cache.values()).map(emoji => ({
                                id: emoji.id,
                                url: emoji.url,
                                name: emoji.name
                            })),
                            members: Array.from(_guild.origin.members.cache.values()).map(member => ({
                                id: member.id,
                                name: member.nickname ? member.nickname : member.displayName
                            })),
                            roles: Array.from(_guild.origin.roles.cache.values()).map(role => ({
                                id: role.id,
                                name: role.name
                            })),
                        };
                        data.guilds.push(guildData);
                    }
                }
                res.send(data);
            }));
        });
    }
    getMessages(express) {
        return __awaiter(this, void 0, void 0, function* () {
            express.get('/console-data/:guildId/:channelId/messages', (req, res) => {
                const data = { channel: req.params.channelId, guild: req.params.guildId, messages: [] };
                const _guild = this.amateras.guilds.cache.get(data.guild);
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
        });
    }
}
exports.Console = Console;
//# sourceMappingURL=Console.js.map