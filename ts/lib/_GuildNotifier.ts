import { Amateras } from "./Amateras";
import { _TextChannel } from "./_TextChannel";
import { ActionRow, ActionRowData, APIEmbed, ButtonComponentData, ButtonStyle, Colors, ComponentType, Embed, Role } from "discord.js";
import { wordCounter } from "../plugins/tools";
import { _BaseGuildObjDB } from "./_BaseGuildObjDB";
import { _Guild } from "./_Guild";
import { youtubeInfo } from "./_Notifier";

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
        const embed: APIEmbed = {
            title: videoInfo.title ? videoInfo.title : undefined,
            url: `https://youtube.com/v/${videoInfo.id}`,
            author: {
                name: videoInfo.channelTitle ? videoInfo.channelTitle : '',
                icon_url: videoInfo.channelThumbnailURL,
                url: videoInfo.channelId ? `https://youtube.com/channel/${videoInfo.channelId}` : undefined
            },
            thumbnail: {
                url: videoInfo.channelThumbnailURL
            },
            color: Colors.Red,
            image: {
                url: videoInfo.thumbnails ? videoInfo.thumbnails.maxres ? videoInfo.thumbnails.maxres.url! : '' : '',
            },
            description: videoInfo.description ? wordCounter(videoInfo.description, 100, 1) : undefined,
            footer: {
                text: 'YouTube',
                icon_url: 'https://www.youtube.com/s/desktop/a14aba22/img/favicon_32x32.png'
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

    async embed(): Promise<APIEmbed | void> {
        const _notifier = this.amateras.notifiers.cache.get(this.id)
        if (!_notifier) return
        const channelInfo = await this.amateras.system.youtube.fetchChannel(this.id)
        if (!channelInfo) return
        return {
            title: channelInfo[0].snippet!.title!,
            thumbnail: {
                url: channelInfo[0].snippet!.thumbnails!.high!.url!,
            },
            description: wordCounter(channelInfo[0].snippet!.description!, 200),
            footer: {
                text: 'YouTube',
                icon_url: 'https://www.youtube.com/s/desktop/a14aba22/img/favicon_32x32.png'
            },
            color: Colors.Red,
        }
    }

    get components(): ActionRowData<ButtonComponentData> {
        return {
            type: ComponentType.ActionRow,
            components: [
                {
                    type: ComponentType.Button,
                    customId: 'subscribeButton',
                    style: ButtonStyle.Primary,
                    label: '????????????',
                },
                {
                    type: ComponentType.Button,
                    customId: 'unsubscribeButton',
                    style: ButtonStyle.Danger,
                    label: '????????????',
                }
            ]
        }
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