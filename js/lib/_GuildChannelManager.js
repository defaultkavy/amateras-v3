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
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __GuildChannelManager_hints;
Object.defineProperty(exports, "__esModule", { value: true });
exports._GuildChannelManager = void 0;
const _BaseGuildManager_1 = require("./_BaseGuildManager");
const _Message_1 = require("./_Message");
const _TextChannel_1 = require("./_TextChannel");
const _ThreadChannel_1 = require("./_ThreadChannel");
class _GuildChannelManager extends _BaseGuildManager_1._BaseGuildManager {
    constructor(amateras, _guild, info) {
        super(amateras, _guild);
        __GuildChannelManager_hints.set(this, void 0);
        __classPrivateFieldSet(this, __GuildChannelManager_hints, info.hints, "f");
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.refresh();
        });
    }
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const channel of this._guild.origin.channels.cache.values()) {
                // filter existed channel
                if (this.cache.has(channel.id))
                    continue;
                this.add(channel);
            }
            for (const hintId of __classPrivateFieldGet(this, __GuildChannelManager_hints, "f")) {
                const hint = yield this.amateras.db.collection('channels_hint').findOne({ id: hintId });
                if (!hint)
                    continue;
                const _channel = this.cache.get(hintId);
                if (!_channel || !_channel.isText())
                    continue;
                const message = hint.messageId ? yield _channel.origin.messages.fetch(hint.messageId).catch(() => undefined) : undefined;
                const info = Object.assign(Object.assign({}, hint), { _message: message ? new _Message_1._Message(this.amateras, { _guild: this._guild, _channel: _channel, message: message, id: message.id }) : undefined });
                _channel.enableHint(info);
            }
        });
    }
    add(channel) {
        if (channel.type === 'GUILD_TEXT' || channel.type === 'GUILD_NEWS') {
            if (!channel.isText())
                return;
            const _channel = new _TextChannel_1._TextChannel(this.amateras, this._guild, channel);
            this.cache.set(_channel.id, _channel);
        }
        else if (channel.isThread()) {
            const _channel = new _ThreadChannel_1._ThreadChannel(this.amateras, this._guild, channel);
            this.cache.set(_channel.id, _channel);
        }
    }
    get(id) {
        const cached = this.cache.get(id);
        if (!cached) {
            this.refresh();
            return this.cache.get(id);
        }
        else
            return cached;
    }
    get hintChannels() {
        const hints = [];
        for (const _channel of this.cache.values()) {
            if (!_channel.isText())
                return;
            if (_channel.hint)
                hints.push(_channel.id);
        }
        return hints;
    }
}
exports._GuildChannelManager = _GuildChannelManager;
__GuildChannelManager_hints = new WeakMap();
//# sourceMappingURL=_GuildChannelManager.js.map