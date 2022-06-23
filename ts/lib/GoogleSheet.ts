import { GaxiosResponse } from 'googleapis-common'
import { GoogleSheetsManager } from './GoogleSheetsManager'
import { sheets_v4 } from "googleapis"

export class GoogleSheet {
    sheet: GaxiosResponse<sheets_v4.Schema$ValueRange>
    data?: any[]
    #sheets: GoogleSheetsManager
    name: string
    constructor(name: string, sheets: GoogleSheetsManager, sheet: GaxiosResponse<sheets_v4.Schema$ValueRange>) {
        this.name = name
        this.sheet = sheet
        this.#sheets = sheets
        this.data = this.build()
    }

    async update() {
        this.#sheets.update(this.name)
    }

    private build() {
        if (!this.sheet) return
        if (!this.sheet.data.values) return
        const result: any[] = []
        const headers = this.sheet.data.values.shift()
        if (!headers) return
        for (const row of this.sheet.data.values) {
            let headersIndex = 0
            const obj: {[key: string]: {}} = {}
            for (const cell of row) {
                obj[headers[headersIndex]] = cell
                headersIndex++
            }
            result.push(obj)
        }
        
        return result
    }
}