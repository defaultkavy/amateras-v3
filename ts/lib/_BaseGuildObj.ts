import { Amateras } from "./Amateras";
import { _Guild } from "./_Guild";

export class _BaseGuildObj {
    amateras: Amateras;
    _guild: _Guild
    constructor(amateras: Amateras, _guild: _Guild) {
        this.amateras = amateras
        this._guild = _guild
    }
}