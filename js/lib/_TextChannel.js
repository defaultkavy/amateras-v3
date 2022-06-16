"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._TextChannel = void 0;
const _BaseGuildChannel_1 = require("./_BaseGuildChannel");
class _TextChannel extends _BaseGuildChannel_1._GuildChannel {
    constructor(amateras, channel) {
        super(amateras, channel);
        this.type = "GUILD_TEXT";
        this.origin = channel;
    }
}
exports._TextChannel = _TextChannel;
//# sourceMappingURL=_TextChannel.js.map