import { Amateras } from "./Amateras";
import { Console } from "./Console.js";
import { _Base } from "./_Base";
import { _Youtube } from "./_Youtube";
import { Snowflake } from "nodejs-snowflake";
import { _LogManager } from "./_LogManager.js";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { Sheets } from "./Sheets.js";

export class System extends _Base {
    token: string
    cert: {private_key: string, client_email: string};
    youtube: _Youtube;
    console: Console;
    snowflake: Snowflake;
    logs: _LogManager;
    sheets: Sheets | undefined;
    constructor(amateras: Amateras) {
        super(amateras)
        this.token = amateras.config.bot.token
        this.logs = new _LogManager(this.amateras)
        this.youtube = new _Youtube(this.amateras)
        this.cert = require('../../certificate.json')
        this.console = new Console(this.amateras)
        this.snowflake = new Snowflake({instance_id: 0})
    }

    async init() {
        await this.fetchSheets()
    }

    async fetchSheets() {
        const spreadsheets = new GoogleSpreadsheet(this.amateras.config.sheets.system)
        await spreadsheets.useServiceAccountAuth(this.amateras.system.cert)
        await spreadsheets.loadInfo()

        if (spreadsheets) {
            this.sheets = new Sheets(this, spreadsheets)
        }
    }

    isReady(): this is ReadySystem {
        if (!this.sheets) return false 
        return true
    }
}

export interface ReadySystem extends System {
    sheets: Sheets
}