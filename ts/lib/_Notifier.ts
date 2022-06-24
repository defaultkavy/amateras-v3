import { Amateras } from "./Amateras";
import { _Base } from "./_Base";
import request from 'request-promise'
import $ from 'cheerio'
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
        const videoInfo = await this.fetchVideo()
        if (!videoInfo) return
        const channelInfo = await this.fetchChannel()
        if (!channelInfo || !channelInfo[0] || !channelInfo[0].snippet) return
        const youtubeInfo = {...videoInfo, channelThumbnailURL: channelInfo[0].snippet.thumbnails!.high!.url!}
        for (const _guild of this.subscribed.values()) {
            const _guildNotifier = _guild.notifiers.cache.get(this.id)
            if (!_guildNotifier) continue
            _guildNotifier.send(youtubeInfo)
        }

        this.videosCache.set(videoInfo.id, youtubeInfo)
    }

    async fetchChannel() {
        return this.amateras.system.youtube.channels.list({
            id: [this.id],
            part: ['snippet,contentDetails,statistics']
        }).then((res) => res.data.items)
    }

    async fetchVideo(): Promise<youtubeVideoInfo | undefined> {
        let videoId: undefined | string = undefined
        return await request(`https://www.youtube.com/channel/${this.id}/live`).then(async (html) => {
            for (const ele of $('link', html)) {
                if (ele.attribs.rel === 'canonical') videoId = ele.attribs.href.slice(ele.attribs.href.length - 11, ele.attribs.href.length)
            }
            
            if (!videoId) return
            const cached = this.videosCache.get(videoId)
            if (cached) return cached
            
            const videoInfo = await this.amateras.system.youtube.videos.list({
                id: [videoId],
                part: ['snippet,contentDetails,statistics,liveStreamingDetails']
            }).then((res) => res.data.items)

            if (!videoInfo || !videoInfo[0] || !videoInfo[0].snippet) return

            return {
                ...videoInfo[0].snippet,
                id: videoInfo[0].id!, 
                startTime: videoInfo[0].liveStreamingDetails!.scheduledStartTime!
            }
        })
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