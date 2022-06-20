import { Amateras } from "./Amateras";
import { _GuildChannel } from "./_BaseGuildChannel";
import { _BaseGuildManager } from "./_BaseGuildManager";
import { _Guild } from "./_Guild";
import { _TextChannel } from "./_TextChannel";
import { _ThreadChannel } from "./_ThreadChannel";

export class _GuildChannelManager extends _BaseGuildManager<_GuildChannel> {
    constructor(amateras: Amateras, _guild: _Guild) {
        super(amateras, _guild)

    }

    async init() {
        this.refresh()
    }

    refresh() {
        this.cache.clear()
        for (const channel of this._guild.origin.channels.cache.values()) {
            if (channel.type === 'GUILD_TEXT') {
                const _channel = new _TextChannel(this.amateras, channel)
                this.cache.set(_channel.id, _channel)
            } else if (channel.type === 'GUILD_PUBLIC_THREAD') {
                const _channel = new _ThreadChannel(this.amateras, channel)
                this.cache.set(_channel.id, _channel)
            }
        }
    }

    get(id: string) {
        const cached = this.cache.get(id)
        if (!cached) {
            this.refresh()
            return this.cache.get(id)
        } else return cached
    }

}