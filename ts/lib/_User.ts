import { User } from "discord.js";
import { Amateras } from "./Amateras";
import { _Base } from "./_Base";
import { _BaseObj } from "./_BaseObj";

export class _User extends _BaseObj {
    origin: User;
    name: string;
    constructor(amateras: Amateras, user: User, info: _UserDB) {
        super(amateras, info, amateras.users.collection, [])
        this.origin = user
        this.name = user.username
    }
    
}

export interface _UserDB {
    id: string;
    index: number;
    name?: string;
}