import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { System } from "./System.js";
import { _Base } from "./_Base.js";

export class Sheets extends _Base {
    sheets: GoogleSpreadsheet["sheetsByTitle"] | undefined
    console: GoogleSpreadsheetWorksheet;
    console_user: GoogleSpreadsheetWorksheet;
    console_ise: GoogleSpreadsheetWorksheet;
    command_access: GoogleSpreadsheetWorksheet;
    constructor(system: System, sheets: GoogleSpreadsheet) {
        super(system.amateras)
        this.console = sheets.sheetsByTitle['Console']
        this.console_user = sheets.sheetsByTitle['ConsoleUserAccessLimit']
        this.console_ise = sheets.sheetsByTitle['ConsoleIseAccessLimit']
        this.command_access = sheets.sheetsByTitle['CommandAccess']
    }
}