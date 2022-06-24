"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._ThreadChannel = void 0;
const _TextBaseChannel_1 = require("./_TextBaseChannel");
class _ThreadChannel extends _TextBaseChannel_1._TextBaseChannel {
    constructor(amateras, _guild, channel) {
        super(amateras, _guild, channel);
        this.origin = channel;
        this.type = channel.type;
    }
}
exports._ThreadChannel = _ThreadChannel;
//# sourceMappingURL=_ThreadChannel.js.map