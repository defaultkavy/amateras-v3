import { Amateras } from "./Amateras.js";
import { _BaseManagerDB } from "./_BaseManagerDB.js";
import { _Log, _LogDB, _LogOptions, _LogTypes } from "./_Log.js";
import fs from 'fs'

export class _LogManager extends _BaseManagerDB<_Log, _LogDB> {
    constructor(amateras: Amateras) {
        super(amateras, amateras.db.collection('logs'))
    }

    async add(content: string, type: _LogTypes) {
        const time = + new Date()
        const log = new _Log(this.amateras, {
            content: content,
            id: `${this.amateras.system.snowflake.idFromTimestamp(time)}`,
            timestamp: time,
            type: type
        })
        this.cache.set(log.id, log)
        await log.save()
        return log
    }

    async log(content: string) {
        const log = await this.add(content, 'LOG')
        fs.appendFileSync(`${global.path}/bot.log`, `\n${log.timestamp} | ${content}`)
    }

    async error(content: string) {
        const error = await this.add(content, 'ERROR')
        fs.appendFileSync(`${global.path}/bot.log`, `\n${error.timestamp} | ${content}`)
    }
}