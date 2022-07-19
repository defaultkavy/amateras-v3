import https from 'https'
import { Amateras } from "./Amateras.js";
import { _Base } from "./_Base.js";

export class _DownloadManager extends _Base {
    constructor(amateras: Amateras) {
        super(amateras)

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