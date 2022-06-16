import { Amateras } from "./Amateras";
import { _Base } from "./_Base";
import { _Guild, _GuildDB } from "./_Guild";
import { _UserDB } from "./_User";

export class _BaseManager<T> extends _Base {
    cache: Map<string, T>;
    constructor(amateras: Amateras) {
        super(amateras)
        this.cache = new Map
    }

    
}