import { TextChannel, ThreadChannelTypes } from "discord.js";
import { Amateras } from "./Amateras";
import { _GuildChannel } from "./_BaseGuildChannel";

export class _TextChannel extends _GuildChannel {
    type: "GUILD_TEXT";
    origin: TextChannel;
    constructor(amateras: Amateras, channel: TextChannel) {
        super(amateras, channel)
        this.type = "GUILD_TEXT"
        this.origin = channel
    }
}