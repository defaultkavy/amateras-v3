import { CategoryChannel, NewsChannel, TextChannel, ThreadChannelTypes } from "discord.js";
import { Amateras } from "./Amateras";
import { _GuildChannel } from "./_GuildChannel";
import { _Guild } from "./_Guild";
import { _Hint, _HintInfo } from "./_Hint";
import { _TextBaseChannel } from "./_TextBaseChannel";

export class _CategoryChannel extends _GuildChannel {
    type: "GUILD_CATEGORY";
    origin: CategoryChannel;
    constructor(amateras: Amateras, _guild: _Guild, channel: CategoryChannel) {
        super(amateras, _guild, channel)
        this.type = channel.type
        this.origin = channel
    }
}