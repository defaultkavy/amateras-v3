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
exports._Hint = void 0;
const _BaseGuildObjDB_1 = require("./_BaseGuildObjDB");
class _Hint extends _BaseGuildObjDB_1._BaseGuildObjDB {
    constructor(amateras, _guild, _channel, info) {
        super(amateras, _guild, info, amateras.db.collection('channels_hint'), ['_channel', '_message']);
        this._channel = _channel;
        this.title = info.title;
        this.description = info.description;
        this._message = info._message;
        this.sending = false;
    }
    send() {
        return __awaiter(this, void 0, void 0, function* () {
            this.sending = true;
            yield this.delete();
            const message = yield this._channel.origin.send({ embeds: [this.hintEmbed] });
            this._message = this.amateras.messages.build(message);
            yield this.save();
            this.sending = false;
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._message)
                yield this._message.origin.delete().catch();
            this._message = undefined;
        });
    }
    get hintEmbed() {
        const embed = {
            title: this.title,
            description: this.description,
            color: "YELLOW"
        };
        return embed;
    }
    presave() {
        return { messageId: this._message ? this._message.id : undefined };
    }
}
exports._Hint = _Hint;
//# sourceMappingURL=_Hint.js.map