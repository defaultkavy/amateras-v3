import { Collection } from "mongodb";
import { cloneObj } from "../plugins/tools";
import { Amateras } from "./Amateras";
import { _Base } from "./_Base";

export class _BaseObj extends _Base {
    id: string;
    index: number;
    #unsave: string[];
    #collection: Collection;
    constructor(amateras: Amateras, info: _BaseDbObjInfo, collection: Collection<any>, unsave: string[] = []) {
        super(amateras)
        this.id = info.id
        this.index = info.index
        this.#unsave = ['origin', 'amateras'].concat(unsave)
        this.#collection = collection
    }

    async save() {
        const data = {...cloneObj(this, this.#unsave), ...this.presave()}
        const find = await this.#collection.findOne({id: this.id})
        if (find) {
            await this.#collection.replaceOne({id: this.id}, data)
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

