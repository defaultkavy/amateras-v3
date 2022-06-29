import { Amateras } from "./Amateras";
import { _Base } from "./_Base";
import { youtube_v3 } from "googleapis";
import { _Guild } from "./_Guild";

export class _Notifier extends _Base {
    id: string;
    timer: NodeJS.Timer | null;
    videosCache: Map<string, youtubeInfo>;
    subscribed: Map<string, _Guild>;
    
    constructor(amateras: Amateras, info: _NotifierInfo) {
        super(amateras)
        this.id = info.id
        this.timer = null
        this.videosCache = new Map
        this.subscribed = new Map
    }

    async start() {
        this.get()
        this.timer = setInterval(this.get.bind(this), 300 * 1000)
    }

    subscribe(_guild: _Guild) {
        this.subscribed.set(_guild.id, _guild)
    }

    async get() {
        const videoId = await this.amateras.system.youtube.fetchStream(this.id)
        if (!videoId) return
        const cached = this.videosCache.get(videoId)
        if (cached) return cached
        const videoInfo = await this.amateras.system.youtube.fetchVideo(videoId)
        if (!videoInfo) return
        const channelInfo = await this.amateras.system.youtube.fetchChannel(this.id)
        if (!channelInfo) return
        if (!channelInfo || !channelInfo[0] || !channelInfo[0].snippet) return
        const youtubeInfo = {...videoInfo, channelThumbnailURL: channelInfo[0].snippet.thumbnails!.high!.url!}

        for (const _guild of this.subscribed.values()) {
            const _guildNotifier = _guild.notifiers.cache.get(this.id)
            if (!_guildNotifier) continue
            _guildNotifier.send(youtubeInfo)
        }

        this.videosCache.set(videoInfo.id, youtubeInfo)
    }
}

export interface youtubeVideoInfo extends youtube_v3.Schema$VideoSnippet {
    id: string,
    startTime: string
}

export interface youtubeInfo extends youtubeVideoInfo {
    channelThumbnailURL: string
}

export interface _NotifierInfo {
    id: string
}