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
exports.Console = void 0;
const google_spreadsheet_1 = require("google-spreadsheet");
const _Base_js_1 = require("./_Base.js");
class Console extends _Base_js_1._Base {
    constructor(amateras) {
        super(amateras);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const spreadsheets = new google_spreadsheet_1.GoogleSpreadsheet('18tQ8_l5tAwCoCFz1O0GvYeuqmTYq4V_DB7r3l01XHeI');
            yield spreadsheets.useServiceAccountAuth(this.amateras.system.cert);
            yield spreadsheets.loadInfo();
            this.sheets = spreadsheets.sheetsByTitle;
        });
    }
    getUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.sheets)
                return;
            const sheet = this.sheets['Console'];
            const rows = yield sheet.getRows();
            const headers = sheet.headerValues;
            const arr = [];
            for (let i = 0; i < rows.length; i++) {
                const obj = {};
                for (const header of headers) {
                    obj[header] = rows[i][header];
                }
                arr.push(obj);
            }
            const user = arr.find((value) => value.username === id);
            return user;
        });
    }
    getLimitAccess() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.sheets)
                return;
            const sheet = this.sheets['ConsoleUserInfo'];
            const rows = yield sheet.getRows();
            const headers = sheet.headerValues;
            const data = {
                channels: [],
                categories: []
            };
            for (const header of headers) {
                for (const row of rows) {
                    data[header].push(row[header]);
                }
            }
            return data;
        });
    }
}
exports.Console = Console;
//# sourceMappingURL=Console.js.map