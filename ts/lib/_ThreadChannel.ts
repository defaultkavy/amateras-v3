import { PrivateThreadChannel, PublicThreadChannel, ThreadChannel, ThreadChannelType } from "discord.js";
import { Amateras } from "./Amateras";
import { _Guild } from "./_Guild";
import { _TextBaseChannel } from "./_TextBaseChannel";

export class _ThreadChannel extends _TextBaseChannel {
    type: ThreadChannelType;
    origin: PublicThreadChannel | PrivateThreadChannel;
    constructor(amateras: Amateras, _guild: _Guild, channel: PublicThreadChannel | PrivateThreadChannel) {
        super(amateras, _guild, channel)
        this.origin = channel
        this.type = channel.type
    }
}