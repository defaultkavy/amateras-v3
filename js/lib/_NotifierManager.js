"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._NotifierManager = void 0;
const _BaseManager_1 = require("./_BaseManager");
const _Notifier_1 = require("./_Notifier");
class _NotifierManager extends _BaseManager_1._BaseManager {
    constructor(amateras) {
        super(amateras);
    }
    add(id, _guild) {
        const cached = this.cache.get(id);
        if (cached) {
            cached.subscribe(_guild);
            if (this.amateras.ready)
                cached.get();
            return cached;
        }
        const obj = new _Notifier_1._Notifier(this.amateras, { id: id });
        this.cache.set(obj.id, obj);
        obj.subscribe(_guild);
        if (this.amateras.ready)
            obj.start();
        return obj;
    }
}
exports._NotifierManager = _NotifierManager;
//# sourceMappingURL=_NotifierManager.js.map