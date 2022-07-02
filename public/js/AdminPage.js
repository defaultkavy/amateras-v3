var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Page } from "./Page";
import { _MessageWrapper } from "./_MessageWrapper";
import { _ReplyInput } from "./_ReplyInput";
export class AdminPage extends Page {
    constructor(client) {
        super(client);
        this.messages = new _MessageWrapper(client, this, document.createElement('message-wrapper'));
        this.reply = new _ReplyInput(client, this, document.createElement('reply-input'));
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    layout() {
        this.node.appendChild(this.reply.node);
        this.node.appendChild(this.messages.node);
    }
}
//# sourceMappingURL=AdminPage.js.map