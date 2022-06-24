"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._TextChannel = void 0;
const _TextBaseChannel_1 = require("./_TextBaseChannel");
class _TextChannel extends _TextBaseChannel_1._TextBaseChannel {
    constructor(amateras, _guild, channel) {
        super(amateras, _guild, channel);
        this.type = channel.type;
        this.origin = channel;
    }
}
exports._TextChannel = _TextChannel;
//# sourceMappingURL=_TextChannel.js.map