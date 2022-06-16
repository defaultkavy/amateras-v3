import { Collection } from "mongodb";
import { cloneObj } from "../plugins/tools";
import { Amateras } from "./Amateras";
import { _Base } from "./_Base";
import { _Guild } from "./_Guild";

export class _BaseGuildObj extends _Base {
    id: string;
    index: number;
    #unsave: string[];
    #collection: Collection;
    _guild: _Guild;
    guildId: string;
    constructor(amateras: Amateras, _guild: _Guild, info: _BaseDbObjInfo, collection: Collection<any>, unsave: string[] = []) {
        super(amateras)
        this._guild = _guild
        this.guildId = _guild.id
        this.id = info.id
        this.index = info.index
        this.#unsave = ['origin', 'amateras', '_guild'].concat(unsave)
        this.#collection = collection
    }

    async save() {
        const data = {...cloneObj(this, this.#unsave), ...this.presave()}
        const find = await this.#collection.findOne({id: this.id, guildId: this.guildId})
        if (find) {
            await this.#collection.replaceOne({id: this.id, guildId: this.guildId}, data)
        } else {
            await this.#collection.insertOne(data)
        }
    }

    presave() {
        return {}
    }
}

export interface _BaseDbObjInfo {
    id: string;
    index: number
}

