import { Message } from "discord.js";
import { Amateras } from "./Amateras";
import { _BaseObj } from "./_BaseObj";
import { _Guild } from "./_Guild";
import { _Notifier_Message } from "./_Notifier_Message";
import { _TextChannel } from "./_TextChannel";

export class _Message extends _BaseObj {
    type = 'TEXT'
    _guild: _Guild;
    _channel: _TextChannel;
    origin: Message<boolean>;
    constructor(amateras: Amateras, info: _MessageInfo) {
        super(amateras, info, amateras.messages.collection, ['_guild', '_channel', 'origin'])
        this._guild = info._guild
        this._channel = info._channel
        this.origin = info.message
    }

    isNotifierPanel(): this is _Notifier_Message {
        return this.type === 'NOTIFIER_PANEL'
    }

    presave() {
        return {
            guildId: this._guild.id,
            channelId: this._channel.id
        }
    }

}

export interface _MessageDB {
    id: string;
    guildId: string;
    channelId: string;
    authorId: string;
    index: number;
    type: _MessageType
    data: any
}

export interface _MessageInfo extends _MessageOptions {
    id: string;
    index: number;
}

export interface _MessageOptions {
    _guild: _Guild;
    _channel: _TextChannel;
    message: Message
}

export type _MessageType = 'TEXT' | 'NOTIFIER_PANEL'