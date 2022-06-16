"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._GuildChannel = void 0;
const _Base_1 = require("./_Base");
class _GuildChannel extends _Base_1._Base {
    constructor(amateras, origin) {
        super(amateras);
        this.id = origin.id;
        this.name = origin.name;
        this.origin = origin;
        this.type = origin.type;
    }
}
exports._GuildChannel = _GuildChannel;
//# sourceMappingURL=_BaseGuildChannel.js.map