"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._GuildChannel = void 0;
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
        if (this.type !== 'GUILD_TEXT' && this.type !== 'GUILD_PUBLIC_THREAD')
            return false;
        return true;
    }
    isText() {
        if (this.type !== 'GUILD_TEXT')
            return false;
        return true;
    }
    isThread() {
        return this.origin.isThread();
    }
    isCategory() {
        if (this.type === 'GUILD_CATEGORY')
            return true;
        else
            return false;
    }
}
exports._GuildChannel = _GuildChannel;
//# sourceMappingURL=_GuildChannel.js.map