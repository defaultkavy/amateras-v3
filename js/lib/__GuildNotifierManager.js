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
exports._GuildNotifierManager = void 0;
const _BaseGuildManager_1 = require("./_BaseGuildManager");
const _GuildNotifier_1 = require("./_GuildNotifier");
const _TextChannel_1 = require("./_TextChannel");
class _GuildNotifierManager extends _BaseGuildManager_1._BaseGuildManager {
    constructor(amateras, _guild) {
        super(amateras, _guild, amateras.db.collection('guild-notifiers'));
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    add(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const _channel = this._guild.channels.get(data.channelId);
            if (!_channel || !(_channel instanceof _TextChannel_1._TextChannel))
                return;
            const notifier = new _GuildNotifier_1._GuildNotifier(this.amateras, this._guild, yield this.buildData(data, _channel));
            this.cache.set(notifier.id, notifier);
            notifier.get();
        });
    }
    buildData(data, _channel) {
        return __awaiter(this, void 0, void 0, function* () {
            return Object.assign(Object.assign({}, data), { index: checkIndex(data) ? data.index : yield this.index(), _channel: _channel });
            function checkIndex(data) {
                return 'index' in data;
            }
        });
    }
}
exports._GuildNotifierManager = _GuildNotifierManager;
//# sourceMappingURL=__GuildNotifierManager.js.map