"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._Notifier_Message = void 0;
const _Message_1 = require("./_Message");
class _Notifier_Message extends _Message_1._Message {
    constructor(amateras, info, data) {
        super(amateras, info);
        this.type = 'NOTIFIER_PANEL';
        this.data = data;
    }
}
exports._Notifier_Message = _Notifier_Message;
//# sourceMappingURL=_Notifier_Message.js.map