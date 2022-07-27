import https from 'https'
import { Amateras } from "./Amateras.js";
import { _Base } from "./_Base.js";
import fs from "fs";
import { Stream } from 'stream';
import p from 'path'

export class _DownloadManager extends _Base {
    constructor(amateras: Amateras) {
        super(amateras)

    }

    async file(url: string, path: string) {
        return new Promise<filePathData>(async (resolve, reject) => {
            const data = new Stream.Transform
            https.get(url, res => {
                const ext = p.extname(url)
                res
                    .on('data', (chunk) => {
                        data.push(chunk)
                    })
                    .on('error', err => {
                        reject(err)
                    })
                    .on('end', async () => {
                        const dir = `${global.path}${path}`
                        const filepath = `${dir}/${this.amateras.system.snowflake.getUniqueID()}${ext}`
                        if (!fs.existsSync(dir)) {
                            fs.mkdirSync(dir, {recursive: true})
                        }
                        fs.writeFileSync(filepath, data.read())
                        resolve({
                            dir_path: filepath,
                            path: `${path}/${this.amateras.system.snowflake.getUniqueID()}.${ext}`
                        })
                    })
            })
        })
    }

    async buffer(url: string) {
        return new Promise<Buffer>((resolve, reject) => {
            const data: Uint8Array[] = []
            https.get(url, res => {
                res
                    .on('data', (chunk) => {
                        data.push(chunk)
                    })
                    .on('error', err => {
                        reject(err)
                    })
                    .on('end', () => {
                        resolve(Buffer.concat(data))
                    })
            })
        })
    }
}

export interface filePathData {
    dir_path: string,
    path: string
}