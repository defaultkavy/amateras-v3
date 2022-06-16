import { Collection } from "mongodb";
import { Amateras } from "./Amateras";
import { _Base } from "./_Base";
import { _Guild, _GuildDB } from "./_Guild";
import { _UserDB } from "./_User";

export class _BaseManagerDB<T, D> extends _Base {
    collection: Collection<D>;
    cache: Map<string, T>;
    constructor(amateras: Amateras, collection: Collection<D>) {
        super(amateras)
        this.collection = collection
        this.cache = new Map
    }
    
    async index() {
        return await this.collection.countDocuments()
    }
}