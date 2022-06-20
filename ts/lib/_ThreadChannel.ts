import { ThreadChannel, ThreadChannelTypes } from "discord.js";
import { Amateras } from "./Amateras";
import { _GuildChannel } from "./_BaseGuildChannel";

export class _ThreadChannel extends _GuildChannel {
    type: ThreadChannelTypes;
    origin: ThreadChannel;
    constructor(amateras: Amateras, channel: ThreadChannel) {
        super(amateras, channel)
        this.origin = channel
        this.type = 'GUILD_PUBLIC_THREAD'
    }
}