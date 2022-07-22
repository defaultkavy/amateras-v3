import { Amateras } from "./Amateras";
import { Console } from "./Console.js";
import { _Base } from "./_Base";
import { _Youtube } from "./_Youtube";
import { Snowflake } from "nodejs-snowflake";
import { _LogManager } from "./_LogManager.js";

export class System extends _Base {
    token: string
    cert: {private_key: string, client_email: string};
    youtube: _Youtube;
    console: Console;
    snowflake: Snowflake;
    logs: _LogManager;
    constructor(amateras: Amateras) {
        super(amateras)
        // @ts-ignore
        this.token = amateras.config.bot.token
        this.logs = new _LogManager(this.amateras)
        this.youtube = new _Youtube(this.amateras)
        this.cert = require('../../certificate.json')
        this.console = new Console(this.amateras)
        this.snowflake = new Snowflake({instance_id: 0})
    }

    async init() {
        this.console.init()
    }
}