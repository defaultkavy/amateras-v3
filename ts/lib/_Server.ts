import { Amateras } from "./Amateras.js";
import { _Base } from "./_Base.js";
import express, { Express } from 'express'
import { ConsoleDB } from "./Console.js";
import cmd from "../plugins/cmd.js";
import requestPromise from "request-promise";

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

    async saveFile(url: string, path: string) {
        return `https://isekai.live/v3/file/` + await requestPromise.post(`${this.amateras.config.server.host}/v3/download`, {
            body: {
                url: url,
                path: path
            },
            json: true
        })
    }

    private serverHandler() {
        return new Promise<void>(resolve => {
            this.express.get('/file/*', (req, res) => {
                if (process.platform === 'win32') {
                    res.send(global.path + req.originalUrl.slice(6).replace('/', '\\'))
                } else res.send(global.path + req.originalUrl.slice(6))
            })

            this.express.post('/download', async(req, res) => {
                const data = req.body as RequestDownloadData
                res.send((await this.amateras.download.file(data.url, data.path)).path)
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

export interface RequestDownloadData {
    url: string,
    path: string,
}