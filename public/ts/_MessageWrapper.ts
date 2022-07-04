import { DiscordChannelMessages } from "./@types/console.js";
import { AdminPage } from "./AdminPage.js";
import { BasePageElement } from "./BasePageElement.js";
import { Client } from "./Client.js";
import { _MessageBox } from "./_MessageBox.js";


export class _MessageWrapper extends BasePageElement {
    page: AdminPage
    lastMessageId: string;
    cache: Map<string, _MessageBox>;
    idle: boolean;
    constructor(client: Client, page: AdminPage, node: HTMLElement) {
        super(client, page, node)
        this.page = page
        this.lastMessageId = ''
        this.cache = new Map
        this.idle = true
        this.init()
    }

    init() {
        this.eventHandler()
    }

    async contentInit() {
        const data = await this.channelMessages(this.page.guildId, this.page.channelId)
        // clear reply link when change channel
        this.page.reply.clear()
        // sort messages
        data.messages.sort((a, b) => a.timestamps - b.timestamps)
        // check last message before update
        this.lastMessageId = data.messages[data.messages.length - 1].id
        // clear
        this.clearChild()
        this.cache.clear()
        for (const message of data.messages) {
            const messageBox = new _MessageBox(this.client, this.page, document.createElement('message-box'), message)
            this.cache.set(message.id, messageBox)
            this.node.appendChild(messageBox.node)
        }
        if (this.idle) this.node.scrollTop = this.node.scrollHeight
    }

    eventHandler() {
        this.node.addEventListener('scroll', (ev) => {
            if (this.node.scrollTop - (this.node.scrollHeight - this.node.clientHeight) > -5)
                this.idle = true
            else this.idle = false
        }, {passive: true})
    }

    async channelMessages(guildId: string, channelId: string) {
        return await (await fetch(client.origin + '/console-data' + `/${guildId}/${channelId}/messages`)).json() as DiscordChannelMessages
    }
}