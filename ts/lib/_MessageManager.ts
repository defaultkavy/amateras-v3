import { MessageOptions, TextChannel, ThreadChannel } from "discord.js";
import { Amateras } from "./Amateras";
import { _BaseManagerDB } from "./_BaseManagerDB";
import { _Message, _MessageDB, _MessageInfo, _MessageOptions, _MessageType } from "./_Message";
import { _Notifier_Message } from "./_Notifier_Message";
import { _TextChannel } from "./_TextChannel";

export class _MessageManager extends _BaseManagerDB<_Message, _MessageDB> {
    constructor(amateras: Amateras) {
        super(amateras, amateras.db.collection('messages'))
    }

    async fetch(id: string) {
        const cached = this.cache.get(id)
        if (cached) return cached
        const find = await this.collection.findOne({id: id})
        if (!find) return
        const loc = this.location(find.guildId, find.channelId)
        if (!loc) return
        const message = await loc._channel.origin.messages.fetch(id)
        let _message
        const data = {...loc, message: message}
        if (find.type === 'NOTIFIER_PANEL') {
            _message = new _Notifier_Message(this.amateras, this.buildData(data, find.index), find.data)
        } else {
            _message = new _Message(this.amateras, this.buildData(data, find.index))
        }
        this.cache.set(_message.id, _message)
        return _message
    }

    async send(channel: TextChannel | ThreadChannel, options: MessageOptions, type: _MessageType, data?: any) {
        const message = await channel.send(options)
        const loc = this.location(message.guildId!, message.channelId)
        if (!loc) return
        const obj = {...loc, message: message}
        let _message
        if (type === 'NOTIFIER_PANEL') {
            _message = new _Notifier_Message(this.amateras, this.buildData(obj, await this.index()), data)
        } else {
            _message = new _Message(this.amateras, this.buildData(obj, await this.index()))

        }
        this.cache.set(_message.id, _message)
        await _message.save()
        return _message
    }

    location(guildId: string, channelId: string) {
        
        const _guild = this.amateras.guilds.cache.get(guildId)
        if (!_guild) return console.debug(1)
        const _channel = _guild.channels.cache.get(channelId)
        if (!_channel || !(_channel instanceof _TextChannel)) return console.debug(2)
        return {
            _guild: _guild,
            _channel: _channel
        }

    }

    buildData(data: _MessageOptions, index: number): _MessageInfo {
        return {
            id: data.message.id,
            _guild: data._guild,
            _channel: data._channel,
            message: data.message,
            index: index
        }
    }
}