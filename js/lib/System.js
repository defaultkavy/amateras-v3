"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.System = void 0;
const googleapis_1 = require("googleapis");
const _Base_1 = require("./_Base");
class System extends _Base_1._Base {
    constructor(amateras) {
        super(amateras);
        this.youtube = googleapis_1.google.youtube({
            version: 'v3',
            // @ts-ignore
            auth: this.amateras.config.youtube.api_key
        });
        this.cert = require('../../certificate.json');
    }
}
exports.System = System;
//# sourceMappingURL=System.js.map