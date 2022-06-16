import { Collection } from "mongodb";
import { Amateras } from "./Amateras";
import { _Base } from "./_Base";
import { _Guild, _GuildDB } from "./_Guild";
import { _UserDB } from "./_User";

export class _BaseGuildManagerDB<T, D> extends _Base {
    cache: Map<string, T>;
    collection: Collection<D>
    _guild: _Guild;
    constructor(amateras: Amateras, _guild: _Guild, collection: Collection<D>) {
        super(amateras)
        this._guild = _guild
        this.collection = collection
        this.cache = new Map
    }
    
    async index() {
        return await this.collection.countDocuments()
    }

    async save() {
        this._guild.save()
    }

    get list() {
        return Array.from(this.cache.keys())
    }
}
