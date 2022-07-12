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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.System = void 0;
const Console_js_1 = require("./Console.js");
const _Base_1 = require("./_Base");
const _Youtube_1 = require("./_Youtube");
const fs_1 = __importDefault(require("fs"));
const nodejs_snowflake_1 = require("nodejs-snowflake");
class System extends _Base_1._Base {
    constructor(amateras) {
        super(amateras);
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
    log(string) {
        return __awaiter(this, void 0, void 0, function* () {
            const time = new Date();
            fs_1.default.appendFileSync(`${global.path}/bot.log`, `\n${time} | ${string}`);
        });
    }
}
exports.System = System;
//# sourceMappingURL=System.js.map