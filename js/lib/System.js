"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.System = void 0;
const _Base_1 = require("./_Base");
const _Youtube_1 = require("./_Youtube");
class System extends _Base_1._Base {
    constructor(amateras) {
        super(amateras);
        this.youtube = new _Youtube_1._Youtube(this.amateras);
        this.cert = require('../../certificate.json');
    }
}
exports.System = System;
//# sourceMappingURL=System.js.map