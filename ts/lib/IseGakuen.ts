import { Amateras } from "./Amateras";
import { _Base } from "./_Base";
import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet'
import { APIEmbed, User } from "discord.js";
import { IseNpc } from "./IseNpc.js";
import { IseNpcManager } from "./IseNpcManager.js";

export class IseGakuen extends _Base {
    grade: string[];
    npc: IseNpcManager;
    sheets?: { [title: string]: GoogleSpreadsheetWorksheet; };
    constructor(amateras: Amateras) {
        super(amateras)
        this.grade = ['', '一年级', '二年级', '三年级']
        this.npc = new IseNpcManager(amateras)
    }

    async init() {
        const spreadsheets = new GoogleSpreadsheet('14t3Fns8vhturMFmrelIkL5XGiTrfqFlSIMsKBDvFP-Y')
        await spreadsheets.useServiceAccountAuth(this.amateras.system.cert)
        await spreadsheets.loadInfo()
        this.sheets = spreadsheets.sheetsByTitle
        await this.npc.init()
    }

    async getStudent(id: string) {
        if (!this.sheets) return
        const sheet = this.sheets['Student Data']
        const rows = await sheet.getRows()
        const headers = sheet.headerValues
        const arr: ISE_STUDENT_DATA[] = []
        for (let i = 0; i < rows.length; i++) {
            const obj: {[key: string]: any} = {}
            for (const header of headers) {
                obj[header] = rows[i][header]
            }
            arr.push(obj as ISE_STUDENT_DATA)
        }
        const playerData = arr.find((value) => value.id === id)
        return playerData
    }

    async getNpc(id: string) {
        if (!this.sheets) {
            return this.amateras.error('ISE: Database not found')
        }
        
        const sheet = this.sheets['NPC Data']

        if (!sheet) {
            return this.amateras.error('ISE: NPC sheet not found')
        }

        const rows = await sheet.getRows()
        const headers = sheet.headerValues
        const arr: ISE_TEACHER_DATA[] = []
        for (let i = 0; i < rows.length; i++) {
            const obj: {[key: string]: any} = {}
            for (const header of headers) {
                obj[header] = rows[i][header]
            }
            arr.push(obj as ISE_TEACHER_DATA)
        }
        const data = arr.find((value) => value.id === id)
        return data
    }

    async registerStudent(user: User) {
        if (!this.sheets) {
            this.amateras.error('ISE: Database not found')
            return 'Database not found'
        }

        const rows = await this.sheets['Student Data'].getRows()
        const row = rows.find((row) => row.tag === user.tag)

        if (!row) {
            this.amateras.error('ISE: No record in sheet')
            return 'No Record'
        }

        row.id = user.id
        await row.save()
        return 'Success'
    }

    async registerStudentImage(user: User, image: string) {
        if (!this.sheets) {
            this.amateras.error('ISE: Database not found')
            return 'Database not found'
        }

        const sheet = this.sheets['Student Data']

        if (!sheet) {
            this.amateras.error('ISE: Student sheet not found')
            return 'Student Sheet Not Found'
        }

        const rows = await this.sheets[''].getRows()
        const row = rows.find((row) => row.id === user.id)

        if (!row) {
            this.amateras.error('ISE: No record in sheet')
            return 'No Record'
        }

        row.characterCard = image
        await row.save()
        return 'Success'
    }
    
    async registerTeacher(npc: IseNpc) {
        if (!this.sheets) {
            this.amateras.error('ISE: Database not found')
            return 'Database not found'
        }

        const sheet = this.sheets['NPC Data']

        if (!sheet) {
            this.amateras.error('ISE: NPC sheet not found')
            return 'NPC Sheet Not Found'
        }

        const rows = await sheet.getRows()
        if (rows.find(row => row.id === npc.id)) return
        await sheet.addRow({id: npc.id, name: npc.name})
        return 'Success'
    }

    async characterCardEmbed(data: ISE_STUDENT_DATA) {
        const embed: APIEmbed = {
            author: {
                name: `${data.name}`
            },
            thumbnail: {
                url: data.characterCard
            },
            fields: [
                {
                    name: `年龄：${data.age}`,
                    value: `年级：${this.grade[+data.grade]}`,
                    inline: true
                },
                {
                    name: `班级：${data.class}`,
                    value: `\u200b`,
                    inline: true
                },
                {
                    name: `种族：${data.race}`,
                    value: `\u200b`,
                    inline: true
                }
            ],
            image: {
                url: 'https://cdn.discordapp.com/attachments/804531119394783276/989579863910408202/white.png'
            }
        }
        return embed
    }
}

export interface ISE_STUDENT_DATA {
    [key: string]: any,
    id: string,
    tag: string,
    name: string,
    username: string,
    age: number,
    gender: 'MALE' | 'FEMALE',
    race: string,
    grade: string,
    characterCard: string,
    class: string
}

export interface ISE_TEACHER_DATA {
    [keys: string]: any,
    id: string,
    name: string,
    age: string,
    height: string,
    gender: string,
    country: string,
    description: string,
    characteristic: string
}