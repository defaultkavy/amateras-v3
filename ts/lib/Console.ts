import { APIEmbed } from "discord-api-types/v9.js";
import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { Amateras, Session } from "./Amateras.js";
import { _Base } from "./_Base.js";

export class Console extends _Base {
    sheets: GoogleSpreadsheet["sheetsByTitle"] | undefined;
    constructor(amateras: Amateras) {
        super(amateras)
    }
    
    async init() {
        const spreadsheets = new GoogleSpreadsheet('18tQ8_l5tAwCoCFz1O0GvYeuqmTYq4V_DB7r3l01XHeI')
        await spreadsheets.useServiceAccountAuth(this.amateras.system.cert)
        await spreadsheets.loadInfo()
        this.sheets = spreadsheets.sheetsByTitle
    }

    async getUser(id: string) {
        if (!this.sheets) return
        const sheet = this.sheets['Console']
        const rows = await sheet.getRows()
        const headers = sheet.headerValues
        const arr: ConsoleDB[] = []
        for (let i = 0; i < rows.length; i++) {
            const obj: {[key: string]: any} = {}
            for (const header of headers) {
                obj[header] = rows[i][header]
            }
            arr.push(obj as ConsoleDB)
        }
        const user = arr.find((value) => value.username === id)
        return user
    }

    async getLimitAccess() {
        if (!this.sheets) return
        const sheet = this.sheets['ConsoleUserInfo']
        const rows = await sheet.getRows()
        const headers = sheet.headerValues
        const data: {[key: string]: string[]} = {
            channels: [],
            categories: []
        }
        for (const header of headers) {
            for (const row of rows) {
                data[header].push(row[header])
            }
        }
        return data
    }
}

export interface ConsoleDB {
    username: string,
    password: string,
    role: 'admin' | 'user'
}

export interface ConsoleLoginInfo extends Session {
    username: string,
    password: string
}

export interface ConsoleData {
    guild: string,
    channel: string,
    content: string,
    reply: string | undefined
}

export interface ConsoleMessageOption {
    id: string,
    content: string,
    author: { name: string, id: string, avatar: string},
    timestamps: number,
    url: string,
    sticker: string | undefined,
    attachments: { type: string | null, url: string }[],
    embeds: APIEmbed[]
}