import { Amateras } from "./Amateras";
import { _TextChannel } from "./_TextChannel";
import { MessageActionRow, MessageActionRowOptions, MessageButtonOptions, MessageComponentOptions, MessageEmbedOptions, Role } from "discord.js";
import { wordCounter } from "../plugins/tools";
import { _BaseGuildObjDB } from "./_BaseGuildObjDB";
import { _Guild } from "./_Guild";
import { youtubeInfo, youtubeVideoInfo } from "./_Notifier";

export class _GuildNotifier extends _BaseGuildObjDB {
    id: string;
    _channel: _TextChannel;
    message?: string;
    role?: Role;
    roleId: string | undefined;
    channelId: string;
    videosSent: Map<string, string>;
    #videosSent: string[];
    constructor(amateras: Amateras, _guild: _Guild, info: _GuildNotifierInfo) {
        super(amateras, _guild, info, _guild.notifiers.collection, ['_channel', 'role', 'videosSent'])
        this.id = info.id
        this.message = info.message
        this.roleId = info.roleId
        this.role = info.roleId ? _guild.origin.roles.cache.get(info.roleId) : undefined
        this._channel = info._channel
        this.channelId = info._channel.id
        this.videosSent = new Map
        this.#videosSent = info.videosSent
        this.init()
    }

    init() {
        for (const videoId of this.#videosSent) this.videosSent.set(videoId, videoId)
    }

    async send(videoInfo: youtubeInfo) {
        if (this.videosSent.has(videoInfo.id)) return
        const time = new Date(videoInfo.startTime)
        const embed: MessageEmbedOptions = {
            title: videoInfo.title ? videoInfo.title : undefined,
            url: `https://youtube.com/v/${videoInfo.id}`,
            author: {
                name: videoInfo.channelTitle ? videoInfo.channelTitle : undefined,
                iconURL: videoInfo.channelThumbnailURL,
                url: videoInfo.channelId ? `https://youtube.com/c/${videoInfo.channelId}` : undefined
            },
            thumbnail: {
                url: videoInfo.channelThumbnailURL
            },
            color: 'RED',
            image: {
                url: videoInfo.thumbnails ? videoInfo.thumbnails.maxres!.url! : undefined,
            },
            description: videoInfo.description ? wordCounter(videoInfo.description, 100, 1) : undefined,
            footer: {
                text: 'YouTube',
                iconURL: 'https://www.youtube.com/s/desktop/a14aba22/img/favicon_32x32.png'
            },
            fields: [
                {
                    name: 'Live start at',
                    value: `${time.toLocaleDateString()} - ${time.toLocaleTimeString()}`,
                    inline: false
                }
            ]
        }
        await this._channel.origin.send({
            content: this.role || this.message ? `${this.role ? this.role : ''}${this.role ? ' - ': ''}${this.message ? this.message : ''}` : undefined,
            embeds: [embed]
        })

        this.videosSent.set(videoInfo.id, videoInfo.id)
        this.save()
    }

    async embed(): Promise<MessageEmbedOptions | void> {
        const _notifier = this.amateras.notifiers.cache.get(this.id)
        if (!_notifier) return
        const channelInfo = await _notifier.fetchChannel()
        if (!channelInfo) return
        return {
            title: channelInfo[0].snippet!.title!,
            thumbnail: {
                url: channelInfo[0].snippet!.thumbnails!.high!.url!,
            },
            description: wordCounter(channelInfo[0].snippet!.description!, 200),
            footer: {
                text: 'YouTube',
                iconURL: 'https://www.youtube.com/s/desktop/a14aba22/img/favicon_32x32.png'
            },
            color: 'RED',
        }
    }

    get components(): MessageActionRow {
        const row = new MessageActionRow
        row.addComponents({
                customId: 'subscribeButton',
                style: 'PRIMARY',
                label: '打开通知',
                type: 'BUTTON'
        })
        row.addComponents({
                customId: 'unsubscribeButton',
                style: 'DANGER',
                label: '关闭通知',
                type: 'BUTTON'
            })
        return row
    }

    presave() {
        return {
            videosSent: Array.from(this.videosSent.keys())
        }
    }
}

export interface _GuildNotifierDB {
    id: string;
    message?: string;
    roleId?: string;
    channelId: string;
    videosSent: string[]
}

export interface _GuildNotifierOptions {
    id: string;
    message?: string;
    roleId?: string;
    channelId: string;
}

export interface _GuildNotifierInfo {
    id: string;
    message?: string;
    roleId?: string;
    _channel: _TextChannel;
    videosSent: string[]
}