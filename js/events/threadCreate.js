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
const request_promise_1 = __importDefault(require("request-promise"));
module.exports = {
    name: 'threadCreate',
    once: false,
    execute(thread, newlyCreated, amateras) {
        return __awaiter(this, void 0, void 0, function* () {
            const _guild = amateras.guilds.cache.get(thread.guild.id);
            if (!_guild)
                return;
            _guild.channels.refresh();
            (0, request_promise_1.default)('http://localhost:5500/console-update').catch(() => { });
        });
    }
};
//# sourceMappingURL=threadCreate.js.map