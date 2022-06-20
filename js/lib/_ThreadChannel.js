"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._ThreadChannel = void 0;
const _BaseGuildChannel_1 = require("./_BaseGuildChannel");
class _ThreadChannel extends _BaseGuildChannel_1._GuildChannel {
    constructor(amateras, channel) {
        super(amateras, channel);
        this.origin = channel;
        this.type = 'GUILD_PUBLIC_THREAD';
    }
}
exports._ThreadChannel = _ThreadChannel;
//# sourceMappingURL=_ThreadChannel.js.map