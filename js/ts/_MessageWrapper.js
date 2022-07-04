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
import { _MessageBox } from "./_MessageBox.js";
export class _MessageWrapper extends BasePageElement {
    constructor(client, page, node) {
        super(client, page, node);
        this.page = page;
        this.lastMessageId = '';
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.channelMessages(this.page.guildId, this.page.channelId);
            // clear reply link when change channel
            this.page.reply.clear();
            // sort messages
            data.messages.sort((a, b) => a.timestamps - b.timestamps);
            // check last message before update
            if (this.lastMessageId === data.messages[data.messages.length - 1].id)
                return;
            this.lastMessageId = data.messages[data.messages.length - 1].id;
            // clear
            this.clearChild();
            for (const message of data.messages) {
                const messageBox = new _MessageBox(this.client, this.page, document.createElement('message-box'), message);
                this.node.appendChild(messageBox.node);
            }
            this.node.scrollTop = this.node.scrollHeight;
        });
    }
    channelMessages(guildId, channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (yield fetch(client.origin + '/console-data' + `/${guildId}/${channelId}/messages`)).json();
        });
    }
}
//# sourceMappingURL=_MessageWrapper.js.map