"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sheets = void 0;
const _Base_js_1 = require("./_Base.js");
class Sheets extends _Base_js_1._Base {
    constructor(system, sheets) {
        super(system.amateras);
        this.console = sheets.sheetsByTitle['Console'];
        this.console_user = sheets.sheetsByTitle['ConsoleUserAccessLimit'];
        this.console_ise = sheets.sheetsByTitle['ConsoleIseAccessLimit'];
        this.command_access = sheets.sheetsByTitle['CommandAccess'];
    }
}
exports.Sheets = Sheets;
//# sourceMappingURL=Sheets.js.map