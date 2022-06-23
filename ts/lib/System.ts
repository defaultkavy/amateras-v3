import { google, youtube_v3 } from "googleapis";
import { Amateras } from "./Amateras";
import { _Base } from "./_Base";

export class System extends _Base {
    youtube: youtube_v3.Youtube;
    cert: {private_key: string, client_email: string};
    constructor(amateras: Amateras) {
        super(amateras)
        this.youtube = google.youtube({
            version: 'v3',
            // @ts-ignore
            auth: this.amateras.config.youtube.api_key
        })
        this.cert = require('../../certificate.json')
    }
}