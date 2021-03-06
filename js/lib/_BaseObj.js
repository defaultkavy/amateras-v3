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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __BaseObj_unsave, __BaseObj_collection;
Object.defineProperty(exports, "__esModule", { value: true });
exports._BaseObj = void 0;
const tools_1 = require("../plugins/tools");
const _Base_1 = require("./_Base");
class _BaseObj extends _Base_1._Base {
    constructor(amateras, info, collection, unsave = []) {
        super(amateras);
        __BaseObj_unsave.set(this, void 0);
        __BaseObj_collection.set(this, void 0);
        this.id = info.id;
        __classPrivateFieldSet(this, __BaseObj_unsave, ['origin', 'amateras'].concat(unsave), "f");
        __classPrivateFieldSet(this, __BaseObj_collection, collection, "f");
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = Object.assign(Object.assign({}, (0, tools_1.cloneObj)(this, __classPrivateFieldGet(this, __BaseObj_unsave, "f"))), yield this.presave());
            const find = yield __classPrivateFieldGet(this, __BaseObj_collection, "f").findOne({ id: this.id });
            if (find) {
                yield __classPrivateFieldGet(this, __BaseObj_collection, "f").replaceOne({ id: this.id }, data);
            }
            else {
                yield __classPrivateFieldGet(this, __BaseObj_collection, "f").insertOne(data);
            }
        });
    }
    presave() {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
}
exports._BaseObj = _BaseObj;
__BaseObj_unsave = new WeakMap(), __BaseObj_collection = new WeakMap();
//# sourceMappingURL=_BaseObj.js.map