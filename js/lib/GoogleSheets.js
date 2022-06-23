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
var _GoogleSheetsManager_auth;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleSheetsManager = void 0;
const googleapis_1 = require("googleapis");
class GoogleSheetsManager {
    constructor(id) {
        _GoogleSheetsManager_auth.set(this, void 0);
        __classPrivateFieldSet(this, _GoogleSheetsManager_auth, new googleapis_1.google.auth.GoogleAuth({
            keyFile: 'certificate.json',
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        }), "f");
        this.api = googleapis_1.google.sheets({
            version: 'v4',
            // @ts-ignore
            auth: __classPrivateFieldGet(this, _GoogleSheetsManager_auth, "f")
        });
        this.id = id;
    }
    load(sheetName) {
        return __awaiter(this, void 0, void 0, function* () {
            this.sheets.await;
            this.api.spreadsheets.values.get({
                spreadsheetId: this.id,
                range: `${sheetName}!A:ZZZ`,
                valueRenderOption: 'UNFORMATTED_VALUE'
            });
            this.build();
            return this.sheets;
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            this.api.spreadsheets.values.update({
                spreadsheetId: this.id,
                range: ''
            });
        });
    }
    build() {
        if (!this.sheets)
            return;
        if (!this.sheets.data.values)
            return;
        const result = [];
        const headers = this.sheets.data.values.shift();
        if (!headers)
            return;
        for (const row of this.sheets.data.values) {
            let headersIndex = 0;
            const obj = {};
            for (const cell of row) {
                obj[headers[headersIndex]] = cell;
                headersIndex++;
            }
            result.push(obj);
        }
        this.data = result;
    }
}
exports.GoogleSheetsManager = GoogleSheetsManager;
_GoogleSheetsManager_auth = new WeakMap();
//# sourceMappingURL=GoogleSheets.js.map