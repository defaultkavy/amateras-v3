import { AdminPage } from "./AdminPage.js";
import { BasePageElement } from "./BasePageElement.js";
import { Client } from "./Client.js";
import { _MessageBox } from "./_MessageBox.js";


export class _MessageWrapper extends BasePageElement {
    page: AdminPage
    lastMessageId: string;
    constructor(client: Client, page: AdminPage, node: HTMLElement) {
        super(client, page, node)
        this.page = page
        this.lastMessageId = ''
    }

    async init() {
        const data = await this.channelMessages(this.page.guildId, this.page.channelId)
        // clear reply link when change channel
        this.page.reply.clear()
        // sort messages
        data.messages.sort((a, b) => a.timestamps - b.timestamps)
        // check last message before update
        if (this.lastMessageId === data.messages[data.messages.length - 1].id) return
        this.lastMessageId = data.messages[data.messages.length - 1].id
        // clear
        this.clearChild()
        for (const message of data.messages) {
            const messageBox = new _MessageBox(this.client, this.page, document.createElement('message-box'), message)
            this.node.appendChild(messageBox.node)
        }
        this.node.scrollTop = this.node.scrollHeight
    }

    async channelMessages(guildId: string, channelId: string) {
        return await (await fetch(client.origin + '/console-data' + `/${guildId}/${channelId}/messages`)).json() as DiscordChannelMessages
    }
}

export interface DiscordChannelMessages {
    channel: string,
    guild: string,
    messages: DiscordMessageOptions[]
}

export interface DiscordMessageOptions {
    id: string,
    content: string,
    author: { name: string, id: string},
    timestamps: number,
    url: string,
    sticker: string | undefined,
    attachments: { type: string | null, url: string }[],
    embeds: []
}