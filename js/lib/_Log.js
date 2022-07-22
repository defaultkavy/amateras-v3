"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._Log = void 0;
const _BaseObj_js_1 = require("./_BaseObj.js");
class _Log extends _BaseObj_js_1._BaseObj {
    constructor(amateras, options) {
        super(amateras, options, amateras.system.logs.collection, []);
        this.content = options.content;
        this.timestamp = options.timestamp;
        this.profile = {
            token: amateras.system.token
        };
        this.type = options.type;
    }
}
exports._Log = _Log;
//# sourceMappingURL=_Log.js.map