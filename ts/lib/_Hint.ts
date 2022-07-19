import { APIEmbed, Colors, Embed, EmbedData } from "discord.js";
import { Amateras } from "./Amateras";
import { _BaseGuildObjDB } from "./_BaseGuildObjDB";
import { _Guild } from "./_Guild";
import { _Message } from "./_Message";
import { _TextBaseChannel } from "./_TextBaseChannel";
import { _TextChannel } from "./_TextChannel";

export class _Hint extends _BaseGuildObjDB {
    title: string | undefined;
    description: string;
    _channel: _TextBaseChannel;
    _message?: _Message
    sending: boolean;
    timeout: boolean;
    constructor(amateras: Amateras, _guild: _Guild, _channel: _TextBaseChannel, info: _HintInfo) {
        super(amateras, _guild, info, amateras.db.collection('channels_hint'), ['_channel', '_message'])
        this._channel = _channel
        this.title = info.title
        this.description = info.description
        this._message = info._message
        this.sending = false
        this.timeout = true
    }

    async send() {
        // Check message is sending or timeout
        if (this.timeout === false || this.sending === true) return
        // Check last message is hint message
        if (this._channel.origin.lastMessage && this._message && this._channel.origin.lastMessage.id === this._message.id) return
        this.sending = true
        this.delete()
        const message = await this._channel.origin.send({embeds: [this.hintEmbed]})
        this._message = this.amateras.messages.build(message)
        await this.save()
        this.sending = false
        //this.timeout = false
        //this.startTimeout()
    }

    async delete() {
        if (this._message) await this._message.origin.delete().catch()
    }

    startTimeout() {
        setTimeout(() => {
            this.timeout = true
            this.send()
        }, 120 * 1000)
    }

    get hintEmbed() {
        const embed: APIEmbed = {
            title: this.title,
            description: this.description,
            color: Colors.Yellow
        }

        return embed
    }

    presave() {
        return {messageId: this._message ? this._message.id : undefined}
    }
}

export interface _HintInfo {
    id: string,
    title?: string,
    description: string
    _message?: _Message
}

export interface _HintDB extends Omit<_HintInfo, '_message'> {
    messageId?: string
}