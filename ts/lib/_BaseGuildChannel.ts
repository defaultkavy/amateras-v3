import { GuildBasedChannel, ThreadChannelTypes } from "discord.js";
import { Amateras } from "./Amateras";
import { _Base } from "./_Base";
import { _TextChannel } from "./_TextChannel";
import { _ThreadChannel } from "./_ThreadChannel";

export class _GuildChannel extends _Base {
    name: string;
    origin: GuildBasedChannel;
    id: string;
    type: "GUILD_CATEGORY" | "GUILD_NEWS" | "GUILD_STAGE_VOICE" | "GUILD_STORE" | "GUILD_TEXT" | ThreadChannelTypes | "GUILD_VOICE";
    constructor(amateras: Amateras, origin: GuildBasedChannel) {
        super(amateras)
        this.id = origin.id
        this.name = origin.name
        this.origin = origin
        this.type = origin.type
        
    }

    isTextBased(): this is _TextChannel | _ThreadChannel {
        if (this.type !== 'GUILD_TEXT' && this.type !== 'GUILD_PUBLIC_THREAD') return false
        return true
    }
}