import { CategoryChannel, ChannelType, GuildBasedChannel, GuildChannel, TextChannel } from "discord.js";
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
import { ConsoleChannelData, ConsoleRole, ConsoleThreadData } from "./Console.js";

export class _GuildChannelManager extends _BaseGuildManager<_GuildChannel> {
    #hints: string[];
    constructor(amateras: Amateras, _guild: _Guild, info: _GuildChannelManagerInfo) {
        super(amateras, _guild)
        this.#hints = info.hints
    }

    async init() {
        await this.refresh()
        setTimeout(() => {
            this.refresh()
        }, 5000);
    }

    async refresh() {
        await this._guild.origin.channels.fetchActiveThreads()
        const channels = this._guild.origin.channels.cache.values()
        for (const channel of channels) {
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

    async add(channel: GuildBasedChannel) {
        if (channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildNews) {
            const _channel = new _TextChannel(this.amateras, this._guild, channel)
            await _channel.init()
            this.cache.set(_channel.id, _channel)
        } else if (channel.isThread()) {
            const _channel = new _ThreadChannel(this.amateras, this._guild, channel)
            await _channel.init()
            this.cache.set(_channel.id, _channel)
        } else if (channel.type === ChannelType.GuildCategory) {
            const _channel = new _CategoryChannel(this.amateras, this._guild, channel)
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

    consoleTextChannels(list: string[] = [], role: ConsoleRole) {
        const texts: ConsoleChannelData[] = []
        for (const _channel of this.cache.values()) {
            if (!_channel.isTextBased()) continue
            const data: ConsoleChannelData = {
                id: _channel.id,
                name: _channel.name,
                parent: _channel.origin.parentId,
                position: _channel.isText() ? _channel.origin.position : undefined,
                access: role === 'admin' ? true : list.includes(_channel.id) ? true : false
            }
            texts.push(data)
        }
        return texts
    }

    consoleCategories() {
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

    consoleThreads() {
        const threads: ConsoleThreadData[] = []
        for (const _channel of this.cache.values()) {
            if (!_channel.isThread()) continue
            const data: ConsoleThreadData = {
                id: _channel.id,
                name: _channel.name,
                parent: _channel.origin.parentId,
                joined: _channel.origin.members.cache.has(this.amateras.me.id)
            }
            threads.push(data)
        }
        return threads
    }

}

export interface _GuildChannelManagerInfo {
    hints: string[]
}