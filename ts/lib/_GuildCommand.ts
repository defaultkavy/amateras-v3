import { removeArrayItem } from "../plugins/tools";
import { Amateras } from "./Amateras";
import { _BaseGuildObjDB } from "./_BaseGuildObjDB";
import { _Guild } from "./_Guild";

export class _GuildCommand extends _BaseGuildObjDB {
    name: string;
    limitedChannels: string[];
    constructor(amateras: Amateras, _guild: _Guild, info: _GuildCommandInfo) {
        super(amateras, _guild, info, amateras.db.collection('guild_commands'))
        this.name = info.name
        this.limitedChannels = info.limitedChannels
    }

    addChannel(channelId: string) {
        this.limitedChannels.push(channelId)
        this.save()
    }

    removeChannel(channelId: string) {
        this.limitedChannels = removeArrayItem(this.limitedChannels, channelId)
        this.save()
    }

}

export interface _GuildCommandInfo extends _GuildCommandDB {
    limitedChannels: string[]
}

export interface _GuildCommandDB  {
    id: string,
    name: string
    limitedChannels?: string[]
}