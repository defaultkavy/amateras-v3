"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
        return __awaiter(this, void 0, void 0, function* () {
            return {
                guildId: this._guild.id,
                channelId: this._channel.id
            };
        });
    }
}
exports._Message = _Message;
//# sourceMappingURL=_Message.js.map