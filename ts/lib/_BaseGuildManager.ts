import { Amateras } from "./Amateras";
import { _Base } from "./_Base";
import { _Guild, _GuildDB } from "./_Guild";
import { _UserDB } from "./_User";

export class _BaseGuildManager<T> extends _Base {
    cache: Map<string, T>;
    _guild: _Guild;
    constructor(amateras: Amateras, _guild: _Guild) {
        super(amateras)
        this._guild = _guild
        this.cache = new Map
    }
}
