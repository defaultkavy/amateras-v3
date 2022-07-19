import { ChannelType, GuildBasedChannel } from "discord.js";
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
    type: Omit<ChannelType, ChannelType.DM | ChannelType.GroupDM>;
    constructor(amateras: Amateras, _guild: _Guild, origin: GuildBasedChannel) {
        super(amateras, _guild)
        this.id = origin.id
        this.name = origin.name
        this.origin = origin
        this.type = origin.type
    }

    isTextBased(): this is _TextChannel | _ThreadChannel {
        if (!this.origin.isTextBased()) return false
        return true
    }

    isText(): this is _TextChannel {
        if (this.type !== ChannelType.GuildText) return false
        return true
    }
    
    isThread(): this is _ThreadChannel {
        return this.origin.isThread()
    }
    
    isCategory(): this is _CategoryChannel {
        if (this.type === ChannelType.GuildCategory) return true
        else return false
    }
}