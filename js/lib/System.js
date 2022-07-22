"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.System = void 0;
const Console_js_1 = require("./Console.js");
const _Base_1 = require("./_Base");
const _Youtube_1 = require("./_Youtube");
const nodejs_snowflake_1 = require("nodejs-snowflake");
const _LogManager_js_1 = require("./_LogManager.js");
class System extends _Base_1._Base {
    constructor(amateras) {
        super(amateras);
        // @ts-ignore
        this.token = amateras.config.bot.token;
        this.logs = new _LogManager_js_1._LogManager(this.amateras);
        this.youtube = new _Youtube_1._Youtube(this.amateras);
        this.cert = require('../../certificate.json');
        this.console = new Console_js_1.Console(this.amateras);
        this.snowflake = new nodejs_snowflake_1.Snowflake({ instance_id: 0 });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.console.init();
        });
    }
}
exports.System = System;
//# sourceMappingURL=System.js.map