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
var __GuildNotifierManager_list;
Object.defineProperty(exports, "__esModule", { value: true });
exports._GuildNotifierManager = void 0;
const _BaseGuildManagerDB_1 = require("./_BaseGuildManagerDB");
const _GuildNotifier_1 = require("./_GuildNotifier");
const _TextChannel_1 = require("./_TextChannel");
class _GuildNotifierManager extends _BaseGuildManagerDB_1._BaseGuildManagerDB {
    constructor(amateras, _guild, info) {
        super(amateras, _guild, amateras.db.collection('guild-notifiers'));
        __GuildNotifierManager_list.set(this, void 0);
        __classPrivateFieldSet(this, __GuildNotifierManager_list, info.list, "f");
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const notifierId of __classPrivateFieldGet(this, __GuildNotifierManager_list, "f")) {
                const find = yield this.collection.findOne({ id: notifierId, guildId: this._guild.id });
                if (!find)
                    continue;
                const _notifier = yield this.add(find);
                if (!_notifier)
                    continue;
                this.cache.set(_notifier.id, _notifier);
            }
        });
    }
    add(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const _channel = this._guild.channels.get(data.channelId);
            if (!_channel || !(_channel instanceof _TextChannel_1._TextChannel))
                return;
            const _guildNotifier = new _GuildNotifier_1._GuildNotifier(this.amateras, this._guild, yield this.buildData(data, _channel));
            yield _guildNotifier.save();
            this.cache.set(_guildNotifier.id, _guildNotifier);
            this.amateras.notifiers.add(data.id, this._guild);
            return _guildNotifier;
        });
    }
    buildData(data, _channel) {
        return __awaiter(this, void 0, void 0, function* () {
            return Object.assign(Object.assign({}, data), { index: checkIndex(data) ? data.index : yield this.index(), _channel: _channel, videosSent: checkIndex(data) ? data.videosSent : [] });
            function checkIndex(data) {
                return 'index' in data;
            }
        });
    }
}
exports._GuildNotifierManager = _GuildNotifierManager;
__GuildNotifierManager_list = new WeakMap();
//# sourceMappingURL=_GuildNotifierManager.js.map