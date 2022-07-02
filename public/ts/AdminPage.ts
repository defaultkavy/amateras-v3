import { Client } from "./Client";
import { Page } from "./Page";
import { _MessageWrapper } from "./_MessageWrapper";
import { _ReplyInput } from "./_ReplyInput";

export class AdminPage extends Page {
    messages: _MessageWrapper;
    reply: _ReplyInput;
    constructor(client: Client) {
        super(client)
        this.messages = new _MessageWrapper(client, this, document.createElement('message-wrapper'))
        this.reply = new _ReplyInput(client, this, document.createElement('reply-input'))
        
        this.init()
    }

    async init() {
        
    }

    private layout() {
        this.node.appendChild(this.reply.node)
        this.node.appendChild(this.messages.node)
    }
}