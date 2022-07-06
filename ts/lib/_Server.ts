import { Amateras } from "./Amateras.js";
import { _Base } from "./_Base.js";
import express, { Express } from 'express'
import { ConsoleDB } from "./Console.js";
import cmd from "../plugins/cmd.js";

export class _Server extends _Base {
    express: Express;
    sessions: Map<string, ConsoleDB>;
    constructor(amateras: Amateras) {
        super(amateras)
        this.express = express()
        this.sessions = new Map
    }

    async init() {
        console.log(cmd.Green, `Initializing Server`)
        console.time('| Server Handler Set')
        this.express.use(express.json())
        this.express.use(express.urlencoded({ extended: true }))
        await this.serverHandler()
        console.timeEnd('| Server Handler Set')
    }

    private serverHandler() {
        return new Promise<void>(resolve => {
            this.express.get('/file/*', (req, res) => {
                if (process.platform === 'win32') {
                    res.send(global.path + req.originalUrl.slice(6).replace('/', '\\'))
                } else res.send(global.path + req.originalUrl.slice(6))
            })
    
            this.express.post('/session', async (req, res) => {
                const data = req.body as { sessionID: string }
                const get = this.sessions.get(data.sessionID)
                if (!get) res.send(false)
                else res.send(true)
            })
    
            // Console
            this.amateras.system.console.login(this.express)
            this.amateras.system.console.get(this.express)
            this.amateras.system.console.post(this.express)
            this.amateras.system.console.getMessages(this.express)
    
            this.express.listen(30, () => {
                console.log('| Port 30 listening.')
                resolve()
            })
        })
    }
}