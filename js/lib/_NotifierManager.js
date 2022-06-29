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
        const _notifier = new _Notifier_1._Notifier(this.amateras, { id: id });
        this.cache.set(_notifier.id, _notifier);
        _notifier.subscribe(_guild);
        if (this.amateras.ready)
            _notifier.start();
        return _notifier;
    }
}
exports._NotifierManager = _NotifierManager;
//# sourceMappingURL=_NotifierManager.js.map