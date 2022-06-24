import { WithId } from "mongodb";
import { Amateras } from "./Amateras";
import { _GuildChannel } from "./_BaseGuildChannel";
import { _BaseGuildManager } from "./_BaseGuildManager";
import { _Guild } from "./_Guild";
import { _HintDB, _HintInfo } from "./_Hint";
import { _Message } from "./_Message";
import { _TextChannel } from "./_TextChannel";
import { _ThreadChannel } from "./_ThreadChannel";

export class _GuildChannelManager extends _BaseGuildManager<_GuildChannel> {
    #hints: string[];
    constructor(amateras: Amateras, _guild: _Guild, info: _GuildChannelManagerInfo) {
        super(amateras, _guild)
        this.#hints = info.hints
    }

    async init() {
        await this.refresh()
    }

    async refresh() {
        for (const channel of this._guild.origin.channels.cache.values()) {
            // filter existed channel
            if (this.cache.has(channel.id)) continue
            if (channel.type === 'GUILD_TEXT') {
                const _channel = new _TextChannel(this.amateras, this._guild, channel)
                this.cache.set(_channel.id, _channel)
            } else if (channel.type === 'GUILD_PUBLIC_THREAD') {
                const _channel = new _ThreadChannel(this.amateras, this._guild, channel)
                this.cache.set(_channel.id, _channel)
            }
        }

        for (const hintId of this.#hints) {
            const hint = await this.amateras.db.collection<_HintDB>('channels_hint').findOne({id: hintId})
            if (!hint) continue
            const _channel = this.cache.get(hintId)
            if (!_channel || !_channel.isText()) continue
            const message = hint.messageId ? await _channel.origin.messages.fetch(hint.messageId).catch(() => undefined) : undefined
            const info: _HintInfo = {
                ...hint,
                _message: message ? new _Message(this.amateras, {_guild: this._guild, _channel: _channel, message: message, id: message.id}) : undefined
            }
            _channel.enableHint(info)
        }
    }

    get(id: string) {
        const cached = this.cache.get(id)
        if (!cached) {
            this.refresh()
            return this.cache.get(id)
        } else return cached
    }

    get hintChannels() {
        const hints: string[] = []
        for (const _channel of this.cache.values()) {
            if (!_channel.isText()) return
            if (_channel.hint) hints.push(_channel.id)
        }
        return hints
    }

}

export interface _GuildChannelManagerInfo {
    hints: string[]
}