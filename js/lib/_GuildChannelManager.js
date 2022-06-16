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
exports._GuildChannelManager = void 0;
const _BaseGuildManager_1 = require("./_BaseGuildManager");
const _TextChannel_1 = require("./_TextChannel");
class _GuildChannelManager extends _BaseGuildManager_1._BaseGuildManager {
    constructor(amateras, _guild) {
        super(amateras, _guild);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.refresh();
        });
    }
    refresh() {
        this.cache.clear();
        for (const channel of this._guild.origin.channels.cache.values()) {
            if (channel.type === 'GUILD_TEXT') {
                const _channel = new _TextChannel_1._TextChannel(this.amateras, channel);
                this.cache.set(_channel.id, _channel);
            }
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
}
exports._GuildChannelManager = _GuildChannelManager;
//# sourceMappingURL=_GuildChannelManager.js.map