import { Amateras } from "./Amateras";
import { _Base } from "./_Base";
import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet'
import { MessageEmbedOptions, User } from "discord.js";
import { IseNpc } from "./IseNpc.js";
import { IseNpcManager } from "./IseNpcManager.js";

export class IseGakuen extends _Base {
    sheet?: GoogleSpreadsheetWorksheet;
    grade: string[];
    npc: IseNpcManager;
    constructor(amateras: Amateras) {
        super(amateras)
        this.grade = ['', '一年级', '二年级', '三年级']
        this.npc = new IseNpcManager(amateras)
    }

    async init() {
        await this.npc.init()

        const spreadsheets = new GoogleSpreadsheet('1zg2rL9zbiCYPdsVgnKrNzhGeK2nlKlM_EH-kw2QGWMk')
        await spreadsheets.useServiceAccountAuth(this.amateras.system.cert)
        await spreadsheets.loadInfo()
        const sheets = spreadsheets.sheetsByTitle
        this.sheet = sheets['Bot Data']
    }

    async getStudent(id: string) {
        if (!this.sheet) return
        const rows = await this.sheet.getRows()
        const headers = this.sheet.headerValues
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

    async register(user: User, image: string) {
        if (!this.sheet) return 'Database not found'
        const rows = await this.sheet.getRows()
        const row = rows.find((row) => row.tag === user.tag)
        if (!row) return 'No Record'
        row.id = user.id
        row.characterCard = image
        await row.save()
        return 'Success'
    }

    async characterCardEmbed(data: ISE_STUDENT_DATA) {
        const embed: MessageEmbedOptions = {
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