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
exports._MessageManager = void 0;
const discord_js_1 = require("discord.js");
const _BaseManagerDB_1 = require("./_BaseManagerDB");
const _Message_1 = require("./_Message");
const _Notifier_Message_1 = require("./_Notifier_Message");
const _TextChannel_1 = require("./_TextChannel");
class _MessageManager extends _BaseManagerDB_1._BaseManagerDB {
    constructor(amateras) {
        super(amateras, amateras.db.collection('messages'));
    }
    fetch(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const cached = this.cache.get(id);
            if (cached)
                return cached;
            const find = yield this.collection.findOne({ id: id });
            if (!find)
                return;
            const loc = this.location(find.guildId, find.channelId);
            if (!loc)
                return;
            const message = yield loc._channel.origin.messages.fetch(id);
            let _message;
            const data = Object.assign(Object.assign({}, loc), { message: message });
            if (find.type === 'NOTIFIER_PANEL') {
                _message = new _Notifier_Message_1._Notifier_Message(this.amateras, this.buildData(data), find.data);
            }
            else {
                _message = new _Message_1._Message(this.amateras, this.buildData(data));
            }
            this.cache.set(_message.id, _message);
            return _message;
        });
    }
    send(channel, options, type, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = yield channel.send(options);
            const loc = this.location(message.guildId, message.channelId);
            if (!loc)
                return;
            const obj = Object.assign(Object.assign({}, loc), { message: message });
            let _message;
            if (type === 'NOTIFIER_PANEL') {
                _message = new _Notifier_Message_1._Notifier_Message(this.amateras, this.buildData(obj), data);
            }
            else {
                _message = new _Message_1._Message(this.amateras, this.buildData(obj));
            }
            this.cache.set(_message.id, _message);
            yield _message.save();
            return _message;
        });
    }
    build(message) {
        if (message.channel.type !== discord_js_1.ChannelType.GuildText)
            return;
        if (!message.guild)
            return;
        const _guild = this.amateras.guilds.cache.get(message.guild.id);
        if (!_guild)
            return;
        const _channel = _guild.channels.get(message.channel.id);
        if (!_channel || !_channel.isTextBased())
            return;
        return new _Message_1._Message(this.amateras, {
            id: message.id,
            _guild: _guild,
            _channel: _channel,
            message: message
        });
    }
    location(guildId, channelId) {
        const _guild = this.amateras.guilds.cache.get(guildId);
        if (!_guild)
            return;
        const _channel = _guild.channels.cache.get(channelId);
        if (!_channel || !(_channel instanceof _TextChannel_1._TextChannel))
            return;
        return {
            _guild: _guild,
            _channel: _channel
        };
    }
    buildData(data) {
        return {
            id: data.message.id,
            _guild: data._guild,
            _channel: data._channel,
            message: data.message,
        };
    }
}
exports._MessageManager = _MessageManager;
//# sourceMappingURL=_MessageManager.js.map