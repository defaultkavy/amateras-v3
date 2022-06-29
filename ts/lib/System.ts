import { google, youtube_v3 } from "googleapis";
import { Amateras } from "./Amateras";
import { _Base } from "./_Base";
import { _Youtube } from "./_Youtube";

export class System extends _Base {
    cert: {private_key: string, client_email: string};
    youtube: _Youtube;
    constructor(amateras: Amateras) {
        super(amateras)
        this.youtube = new _Youtube(this.amateras)
        this.cert = require('../../certificate.json')
    }
}