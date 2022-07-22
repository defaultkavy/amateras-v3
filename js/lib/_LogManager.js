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
exports._LogManager = void 0;
const _BaseManagerDB_js_1 = require("./_BaseManagerDB.js");
const _Log_js_1 = require("./_Log.js");
const fs_1 = __importDefault(require("fs"));
class _LogManager extends _BaseManagerDB_js_1._BaseManagerDB {
    constructor(amateras) {
        super(amateras, amateras.db.collection('logs'));
    }
    add(content, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const time = +new Date();
            const log = new _Log_js_1._Log(this.amateras, {
                content: content,
                id: `${this.amateras.system.snowflake.idFromTimestamp(time)}`,
                timestamp: time,
                type: type
            });
            this.cache.set(log.id, log);
            yield log.save();
            return log;
        });
    }
    log(content) {
        return __awaiter(this, void 0, void 0, function* () {
            const log = yield this.add(content, 'LOG');
            fs_1.default.appendFileSync(`${global.path}/bot.log`, `\n${log.timestamp} | ${content}`);
        });
    }
    error(content) {
        return __awaiter(this, void 0, void 0, function* () {
            const error = yield this.add(content, 'ERROR');
            fs_1.default.appendFileSync(`${global.path}/bot.log`, `\n${error.timestamp} | ${content}`);
        });
    }
}
exports._LogManager = _LogManager;
//# sourceMappingURL=_LogManager.js.map