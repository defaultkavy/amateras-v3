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
exports._WebhookManager = void 0;
const _BaseGuildManager_js_1 = require("./_BaseGuildManager.js");
class _WebhookManager extends _BaseGuildManager_js_1._BaseGuildManager {
    constructor(amateras, _guild, _channel) {
        super(amateras, _guild);
        this._channel = _channel;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const webhooks = yield this._channel.origin.fetchWebhooks();
            for (const webhook of webhooks.values()) {
                this.cache.set(webhook.id, webhook);
            }
        });
    }
    create(name, avatar, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            const webhook = yield this._channel.origin.createWebhook({
                name: name,
                avatar: avatar,
                reason: reason
            });
            this.cache.set(webhook.id, webhook);
            return webhook;
        });
    }
}
exports._WebhookManager = _WebhookManager;
//# sourceMappingURL=_WebhookManager.js.map