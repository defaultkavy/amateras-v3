var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BasePageElement } from "./BasePageElement.js";
import { MessageBox } from "./MessageBox.js";
export class _MessageWrapper extends BasePageElement {
    constructor(client, page, node) {
        super(client, page, node);
        this.page = page;
        this.lastMessageId = '';
        this.cache = new Map;
        this.idle = true;
        this.init();
    }
    init() {
        this.eventHandler();
    }
    contentInit(refresh = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.channelMessages(this.page.guildId, this.page.channelId);
            // clear reply link when change channel
            this.page.reply.clear();
            // sort messages
            data.messages.sort((a, b) => a.timestamps - b.timestamps);
            // check last message before update
            this.lastMessageId = data.messages[data.messages.length - 1].id;
            // clear
            this.clearChild();
            this.cache.clear();
            for (const message of data.messages) {
                const messageBox = new MessageBox(this.client, this.page, document.createElement('message-box'), message);
                this.cache.set(message.id, messageBox);
                this.node.appendChild(messageBox.node);
            }
            if (this.idle || refresh === true)
                this.node.scrollTop = this.node.scrollHeight;
        });
    }
    eventHandler() {
        this.node.addEventListener('scroll', (ev) => {
            if (this.node.scrollTop - (this.node.scrollHeight - this.node.clientHeight) > -5)
                this.idle = true;
            else
                this.idle = false;
        }, { passive: true });
    }
    channelMessages(guildId, channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (yield fetch(client.origin + '/console-data' + `/${guildId}/${channelId}/messages`)).json();
        });
    }
}
//# sourceMappingURL=_MessageWrapper.js.map