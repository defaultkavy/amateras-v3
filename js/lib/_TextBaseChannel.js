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
exports._TextBaseChannel = void 0;
const _BaseGuildChannel_1 = require("./_BaseGuildChannel");
const _Hint_1 = require("./_Hint");
class _TextBaseChannel extends _BaseGuildChannel_1._GuildChannel {
    constructor(amateras, _guild, channel) {
        super(amateras, _guild, channel);
        this.origin = channel;
    }
    enableHint(info) {
        return __awaiter(this, void 0, void 0, function* () {
            this.hint = new _Hint_1._Hint(this.amateras, this._guild, this, info);
            yield this.hint.save();
            yield this._guild.save();
            return this.hint;
        });
    }
    disableHint() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.hint)
                return 'Hint function no enabled';
            yield this.hint.delete();
            this.hint = undefined;
            yield this._guild.save();
            return 'Hint function turn off';
        });
    }
}
exports._TextBaseChannel = _TextBaseChannel;
//# sourceMappingURL=_TextBaseChannel.js.map