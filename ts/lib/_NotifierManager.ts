import { Amateras } from "./Amateras";
import { _BaseManager } from "./_BaseManager";
import { _Guild } from "./_Guild";
import { _Notifier } from "./_Notifier";

export class _NotifierManager extends _BaseManager<_Notifier> {
    constructor(amateras: Amateras) {
        super(amateras)
    }
    
    add(id: string, _guild: _Guild) {
        const cached = this.cache.get(id)
        if (cached) {
            cached.subscribe(_guild)
            if (this.amateras.ready) cached.get()
            return cached
        }
        const obj = new _Notifier(this.amateras, {id: id})
        this.cache.set(obj.id, obj)
        obj.subscribe(_guild)
        if (this.amateras.ready) obj.start()
        return obj
    }
}