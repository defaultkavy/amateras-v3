import { google, youtube_v3 } from "googleapis";
import { Amateras } from "./Amateras";
import { Console } from "./Console.js";
import { _Base } from "./_Base";
import { _Youtube } from "./_Youtube";
import fs from 'fs'
import { Snowflake } from "nodejs-snowflake";

export class System extends _Base {
    cert: {private_key: string, client_email: string};
    youtube: _Youtube;
    console: Console;
    snowflake: Snowflake;
    constructor(amateras: Amateras) {
        super(amateras)
        this.youtube = new _Youtube(this.amateras)
        this.cert = require('../../certificate.json')
        this.console = new Console(this.amateras)
        this.snowflake = new Snowflake({instance_id: 0})
    }

    async init() {
        this.console.init()
    }

    async log(string: string) {
        const time = new Date()
        fs.appendFileSync(`${global.path}/bot.log`, `\n${time} | ${string}`)
    }
}