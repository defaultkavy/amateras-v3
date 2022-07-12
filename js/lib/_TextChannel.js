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
exports._TextChannel = void 0;
const _TextBaseChannel_1 = require("./_TextBaseChannel");
const _WebhookManager_js_1 = require("./_WebhookManager.js");
class _TextChannel extends _TextBaseChannel_1._TextBaseChannel {
    constructor(amateras, _guild, channel) {
        super(amateras, _guild, channel);
        this.type = channel.type;
        this.origin = channel;
        this.webhooks = new _WebhookManager_js_1._WebhookManager(amateras, _guild, this);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.webhooks.init();
            this.origin.messages.fetch({ limit: 100 });
        });
    }
}
exports._TextChannel = _TextChannel;
//# sourceMappingURL=_TextChannel.js.map