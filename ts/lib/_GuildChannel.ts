import { GuildBasedChannel, ThreadChannelTypes } from "discord.js";
import { Amateras } from "./Amateras";
import { _BaseGuildObj } from "./_BaseGuildObj";
import { _CategoryChannel } from "./_CategoryChannel";
import { _Guild } from "./_Guild";
import { _TextChannel } from "./_TextChannel";
import { _ThreadChannel } from "./_ThreadChannel";

export class _GuildChannel extends _BaseGuildObj {
    name: string;
    origin: GuildBasedChannel;
    id: string;
    type: "GUILD_CATEGORY" | "GUILD_NEWS" | "GUILD_STAGE_VOICE" | "GUILD_STORE" | "GUILD_TEXT" | ThreadChannelTypes | "GUILD_VOICE";
    constructor(amateras: Amateras, _guild: _Guild, origin: GuildBasedChannel) {
        super(amateras, _guild)
        this.id = origin.id
        this.name = origin.name
        this.origin = origin
        this.type = origin.type
    }

    isTextBased(): this is _TextChannel | _ThreadChannel {
        if (this.type !== 'GUILD_TEXT' && this.type !== 'GUILD_PUBLIC_THREAD') return false
        return true
    }

    isText(): this is _TextChannel {
        if (this.type !== 'GUILD_TEXT') return false
        return true
    }
    
    isCategory(): this is _CategoryChannel {
        if (this.type === 'GUILD_CATEGORY') return true
        else return false
    }
}