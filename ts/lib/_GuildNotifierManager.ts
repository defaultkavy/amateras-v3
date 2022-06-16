import { Amateras } from "./Amateras";
import { _BaseGuildManagerDB } from "./_BaseGuildManagerDB";
import { _Guild } from "./_Guild";
import { _GuildNotifier, _GuildNotifierDB, _GuildNotifierInfo, _GuildNotifierOptions } from "./_GuildNotifier";
import { _TextChannel } from "./_TextChannel";

export class _GuildNotifierManager extends _BaseGuildManagerDB<_GuildNotifier, _GuildNotifierDB> {
    #list: string[]
    constructor(amateras: Amateras, _guild: _Guild, info: _GuildNotifierManagerInfo) {
        super(amateras, _guild, amateras.db.collection('guild-notifiers'))
        this.#list = info.list
    }

    async init() {
        for (const notifierId of this.#list) {
            const find = await this.collection.findOne({id: notifierId, guildId: this._guild.id})
            if (!find) continue
            const _notifier = await this.add(find)
            if (!_notifier) continue
            this.cache.set(_notifier.id, _notifier)
        }
    }

    async add(data: _GuildNotifierOptions | _GuildNotifierDB) {
        const _channel = this._guild.channels.get(data.channelId)
        if (!_channel || !(_channel instanceof _TextChannel)) return
        const _guildNotifier = new _GuildNotifier(this.amateras, this._guild, await this.buildData(data, _channel))
        await _guildNotifier.save()
        this.cache.set(_guildNotifier.id, _guildNotifier)
        this.amateras.notifiers.add(data.id, this._guild)
        return _guildNotifier
    }

    async buildData(data: _GuildNotifierOptions | _GuildNotifierDB, _channel: _TextChannel): Promise<_GuildNotifierInfo> {
        return {
            ...data,
            index: checkIndex(data) ? data.index : await this.index(),
            _channel: _channel,
            videosSent: checkIndex(data) ? data.videosSent : []
        }

        function checkIndex(data: _GuildNotifierOptions | _GuildNotifierDB): data is _GuildNotifierDB {
            return 'index' in data
        }
    }
}

export interface _GuildNotifierManagerInfo {
    list: string[]
}