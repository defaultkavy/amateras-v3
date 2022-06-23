import { GoogleAuth } from "google-auth-library"
import { google, sheets_v4 } from "googleapis"
import { GoogleSheet } from "./GoogleSheet"

export class GoogleSheetsManager {
    #auth: GoogleAuth
    api: sheets_v4.Sheets
    sheets?: GoogleSheet
    readonly id: string
    constructor(id: string) {
        this.#auth = new google.auth.GoogleAuth({
            keyFile: 'certificate.json',
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        })
        this.api = google.sheets({
            version: 'v4',
            // @ts-ignore
            auth: this.#auth
        })
        this.id = id
    }

    async loadSheet(sheetName: string) {
        return new GoogleSheet(sheetName, this, await this.api.spreadsheets.values.get({
            spreadsheetId: this.id, 
            range: `${sheetName}!A:ZZZ`,
            valueRenderOption: 'UNFORMATTED_VALUE'
        }))
    }

    async update(sheetName: string) {
        await this.api.spreadsheets.values.update({
            spreadsheetId: this.id,
            range: `${sheetName}!A:B`,
            valueInputOption: 'RAW',
            requestBody: {
                range: `${sheetName}!A:B`,
                values: [[123], [123,123]]
            }
        })
    }

}