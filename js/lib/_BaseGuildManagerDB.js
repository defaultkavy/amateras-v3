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
exports._BaseGuildManagerDB = void 0;
const _Base_1 = require("./_Base");
class _BaseGuildManagerDB extends _Base_1._Base {
    constructor(amateras, _guild, collection) {
        super(amateras);
        this._guild = _guild;
        this.collection = collection;
        this.cache = new Map;
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            this._guild.save();
        });
    }
    get list() {
        return Array.from(this.cache.keys());
    }
}
exports._BaseGuildManagerDB = _BaseGuildManagerDB;
//# sourceMappingURL=_BaseGuildManagerDB.js.map