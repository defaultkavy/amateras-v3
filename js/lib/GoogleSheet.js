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
var _GoogleSheet_sheets;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleSheet = void 0;
class GoogleSheet {
    constructor(name, sheets, sheet) {
        _GoogleSheet_sheets.set(this, void 0);
        this.name = name;
        this.sheet = sheet;
        __classPrivateFieldSet(this, _GoogleSheet_sheets, sheets, "f");
        this.data = this.build();
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            __classPrivateFieldGet(this, _GoogleSheet_sheets, "f").update(this.name);
        });
    }
    build() {
        if (!this.sheet)
            return;
        if (!this.sheet.data.values)
            return;
        const result = [];
        const headers = this.sheet.data.values.shift();
        if (!headers)
            return;
        for (const row of this.sheet.data.values) {
            let headersIndex = 0;
            const obj = {};
            for (const cell of row) {
                obj[headers[headersIndex]] = cell;
                headersIndex++;
            }
            result.push(obj);
        }
        return result;
    }
}
exports.GoogleSheet = GoogleSheet;
_GoogleSheet_sheets = new WeakMap();
//# sourceMappingURL=GoogleSheet.js.map