"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._GuildChannel = void 0;
const discord_js_1 = require("discord.js");
const _BaseGuildObj_1 = require("./_BaseGuildObj");
class _GuildChannel extends _BaseGuildObj_1._BaseGuildObj {
    constructor(amateras, _guild, origin) {
        super(amateras, _guild);
        this.id = origin.id;
        this.name = origin.name;
        this.origin = origin;
        this.type = origin.type;
    }
    isTextBased() {
        if (!this.origin.isTextBased())
            return false;
        return true;
    }
    isText() {
        if (this.type !== discord_js_1.ChannelType.GuildText)
            return false;
        return true;
    }
    isThread() {
        return this.origin.isThread();
    }
    isCategory() {
        if (this.type === discord_js_1.ChannelType.GuildCategory)
            return true;
        else
            return false;
    }
}
exports._GuildChannel = _GuildChannel;
//# sourceMappingURL=_GuildChannel.js.map