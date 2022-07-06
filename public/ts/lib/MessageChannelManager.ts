import { AdminPage } from "./AdminPage.js";
import { BasePageElement } from "./BasePageElement.js";
import { Client } from "./Client.js";
import { MessageChannel } from "./MessageChannel.js";
import { _Guild } from "./_Guild.js";

export class MessageChannelManager extends BasePageElement {
    cache: Map<string, MessageChannel>
    page: AdminPage
    channel: undefined | MessageChannel;
    constructor(client: Client, page: AdminPage, node: HTMLElement) {
        super(client, page, node)
        this.page = page
        this.cache = new Map
        this.channel = undefined
    }
    
    async load() {
        // check channel is same
        if (this.channel && this.page.channelId === this.channel.id) {
            await this.channel.contentInit()
            this.channel.scrollBottom()
            return
        }
        //
        const guild = this.client.guilds.cache.get(this.page.guildId)
        if (!guild) return
        this.clearChild()
        // check channel is exist
        const get = this.cache.get(this.page.channelId)
        if (get) {
            await get.contentInit()
            this.node.appendChild(get.node)
            this.channel = get
            this.channel.scrollBottom(true)
            return
        }
        //
        const channel = new MessageChannel(this.client, this.page, guild, this.page.channelId, document.createElement('message-channel'))
        this.cache.set(this.page.channelId, channel)
        await channel.init()
        this.node.appendChild(channel.node)
        this.channel = channel
        this.channel.scrollBottom(true)
        
        return channel
    }
}