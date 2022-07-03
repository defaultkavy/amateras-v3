import { CategoryChannel, GuildBasedChannel, GuildChannel, TextChannel } from "discord.js";
import { WithId } from "mongodb";
import { Amateras } from "./Amateras";
import { _GuildChannel } from "./_GuildChannel";
import { _BaseGuildManager } from "./_BaseGuildManager";
import { _CategoryChannel } from "./_CategoryChannel";
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
            this.add(channel)
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

    add(channel: GuildBasedChannel | GuildChannel) {
        if (channel.type === 'GUILD_TEXT' || channel.type === 'GUILD_NEWS') {
            if (!channel.isText()) return
            const _channel = new _TextChannel(this.amateras, this._guild, channel)
            this.cache.set(_channel.id, _channel)
        } else if (channel.isThread()) {
            const _channel = new _ThreadChannel(this.amateras, this._guild, channel)
            this.cache.set(_channel.id, _channel)
        } else if (channel.type === 'GUILD_CATEGORY') {
            const _channel = new _CategoryChannel(this.amateras, this._guild, channel as CategoryChannel)
            this.cache.set(_channel.id, _channel)
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

    get textChannels() {
        const text: {
            id: string;
            name: string;
        }[] = []
        for (const _channel of this.cache.values()) {
            if (!_channel.isTextBased()) continue
            const data = {
                id: _channel.id,
                name: _channel.name,
                parent: _channel.origin.parentId,
                position: _channel.isText() ? _channel.origin.position : undefined
            }
            text.push(data)
        }
        return text
    }

    get categories() {
        const categories = []
        for (const _channel of this.cache.values()) {
            if (!_channel.isCategory()) continue
            const data = {
                id: _channel.id,
                name: _channel.name,
                position: _channel.origin.position
            }
            categories.push(data)
        }
        return categories
    }

    listCategories(list: string[]) {
        const categories = []
        for (const id of list) {
            const _channel = this.cache.get(id)
            if (!_channel || !_channel.isCategory()) continue
            const data = {
                id: _channel.id,
                name: _channel.name,
                position: _channel.origin.position
            }
            categories.push(data)
        }
        return categories
    }

    listTextChannels(list: string[]) {
        const channels = []
        for (const id of list) {
            const _channel = this.cache.get(id)
            if (!_channel || !_channel.isTextBased()) continue
            const data = {
                id: _channel.id,
                name: _channel.name,
                parent: _channel.origin.parentId,
                position: _channel.isText() ? _channel.origin.position : undefined
            }
            channels.push(data)
        }
        return channels
    }

}

export interface _GuildChannelManagerInfo {
    hints: string[]
}