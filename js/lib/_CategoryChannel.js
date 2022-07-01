"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._CategoryChannel = void 0;
const _GuildChannel_1 = require("./_GuildChannel");
class _CategoryChannel extends _GuildChannel_1._GuildChannel {
    constructor(amateras, _guild, channel) {
        super(amateras, _guild, channel);
        this.type = channel.type;
        this.origin = channel;
    }
}
exports._CategoryChannel = _CategoryChannel;
//# sourceMappingURL=_CategoryChannel.js.map