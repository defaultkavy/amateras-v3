"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._Message = void 0;
const _BaseObj_1 = require("./_BaseObj");
class _Message extends _BaseObj_1._BaseObj {
    constructor(amateras, info) {
        super(amateras, info, amateras.messages.collection, ['_guild', '_channel', 'origin']);
        this.type = 'TEXT';
        this._guild = info._guild;
        this._channel = info._channel;
        this.origin = info.message;
    }
    isNotifierPanel() {
        return this.type === 'NOTIFIER_PANEL';
    }
    presave() {
        return {
            guildId: this._guild.id,
            channelId: this._channel.id
        };
    }
}
exports._Message = _Message;
//# sourceMappingURL=_Message.js.map