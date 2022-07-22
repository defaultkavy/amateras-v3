import { Amateras } from "./Amateras.js";
import { _BaseObj } from "./_BaseObj.js";

export class _Log extends _BaseObj {
    content: string;
    timestamp: number;
    type: 'LOG' | 'ERROR';
    profile: _Profile;
    constructor(amateras: Amateras, options: _LogOptions) {
        super(amateras, options, amateras.system.logs.collection, [])
        this.content = options.content
        this.timestamp = options.timestamp
        this.profile = {
            token: amateras.system.token
        }
        this.type = options.type
    }
}

export interface _LogOptions {
    id: string,
    content: string,
    timestamp: number,
    type: _LogTypes
}

export interface _LogDB extends _LogOptions {
}

export interface _Profile {
    token: string
}

export type _LogTypes = 'LOG' | 'ERROR'