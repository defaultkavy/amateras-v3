import { TextChannel, ThreadChannelTypes } from "discord.js";
import { Amateras } from "./Amateras";
import { _Guild } from "./_Guild";
import { _Hint, _HintInfo } from "./_Hint";
import { _TextBaseChannel } from "./_TextBaseChannel";

export class _TextChannel extends _TextBaseChannel {
    type: "GUILD_TEXT";
    origin: TextChannel;
    hint?: _Hint;
    constructor(amateras: Amateras, _guild: _Guild, channel: TextChannel) {
        super(amateras, _guild, channel)
        this.type = "GUILD_TEXT"
        this.origin = channel
    }
}