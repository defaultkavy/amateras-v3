import { Webhook } from "discord.js";
import { Amateras } from "./Amateras.js";
import { _BaseGuildManager } from "./_BaseGuildManager.js";
import { _Guild } from "./_Guild.js";
import { _TextChannel } from "./_TextChannel.js";

export class _WebhookManager extends _BaseGuildManager<Webhook> {
    _channel: _TextChannel;
    constructor(amateras: Amateras, _guild: _Guild, _channel: _TextChannel) {
        super(amateras, _guild)
        this._channel = _channel
    }

    async init() {
        const webhooks = await this._channel.origin.fetchWebhooks()
        for (const webhook of webhooks.values()) {
            this.cache.set(webhook.id, webhook)
        }
    }

    async create(name: string, avatar: string, reason: string) {
        const webhook = await this._channel.origin.createWebhook({
            name: name,
            avatar: avatar,
            reason: reason
        })
        this.cache.set(webhook.id, webhook)
        return webhook
    }
}