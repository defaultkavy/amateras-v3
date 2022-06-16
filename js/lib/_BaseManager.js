"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._BaseManager = void 0;
const _Base_1 = require("./_Base");
class _BaseManager extends _Base_1._Base {
    constructor(amateras) {
        super(amateras);
        this.cache = new Map;
    }
}
exports._BaseManager = _BaseManager;
//# sourceMappingURL=_BaseManager.js.map