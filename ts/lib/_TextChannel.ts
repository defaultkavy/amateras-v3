import { NewsChannel, TextChannel, ThreadChannelTypes } from "discord.js";
import { Amateras } from "./Amateras";
import { _Guild } from "./_Guild";
import { _Hint, _HintInfo } from "./_Hint";
import { _TextBaseChannel } from "./_TextBaseChannel";
import { _WebhookManager } from "./_WebhookManager.js";

export class _TextChannel extends _TextBaseChannel {
    type: "GUILD_TEXT" | "GUILD_NEWS";
    origin: TextChannel | NewsChannel;
    hint?: _Hint;
    webhooks: _WebhookManager;
    constructor(amateras: Amateras, _guild: _Guild, channel: TextChannel | NewsChannel) {
        super(amateras, _guild, channel)
        this.type = channel.type
        this.origin = channel
        this.webhooks = new _WebhookManager(amateras, _guild, this)
    }

    async init() {
        await this.webhooks.init()
        this.origin.messages.fetch({limit: 100})
    }
}