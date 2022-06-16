"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._BaseGuildManager = void 0;
const _Base_1 = require("./_Base");
class _BaseGuildManager extends _Base_1._Base {
    constructor(amateras, _guild) {
        super(amateras);
        this._guild = _guild;
        this.cache = new Map;
    }
}
exports._BaseGuildManager = _BaseGuildManager;
//# sourceMappingURL=_BaseGuildManager.js.map