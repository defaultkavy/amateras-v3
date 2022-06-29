import { google, youtube_v3 } from "googleapis";
import request from 'request-promise'
import $ from 'cheerio'
import { Amateras } from "./Amateras";
import { _Base } from "./_Base";
import { youtubeVideoInfo } from "./_Notifier";

export class _Youtube extends _Base {
    api: youtube_v3.Youtube;
    constructor(amateras: Amateras) {
        super(amateras)
        this.api = google.youtube({
            version: 'v3',
            // @ts-ignore
            auth: this.amateras.config.youtube.api_key
        })
    }

    async fetchChannel(id: string) {
        const channel = await this.amateras.system.youtube.api.channels.list({
            id: [id],
            part: ['snippet,contentDetails,statistics']
        }).catch(() => undefined)
        if (!channel) return
        return channel.data.items
    }

    async fetchStream(channelId: string) {
        return await request(`https://www.youtube.com/channel/${channelId}/live`).then(async (html) => {
            for (const ele of $('link', html)) {
                if (ele.attribs.rel === 'canonical') return ele.attribs.href.slice(ele.attribs.href.length - 11, ele.attribs.href.length)
            }
        })
    }

    async fetchVideo(id: string): Promise<youtubeVideoInfo | undefined> {
        
        const videoInfo = await this.amateras.system.youtube.api.videos.list({
            id: [id],
            part: ['snippet,contentDetails,statistics,liveStreamingDetails']
        }).then((res) => res.data.items)

        if (!videoInfo || !videoInfo[0] || !videoInfo[0].snippet) return

        return {
            ...videoInfo[0].snippet,
            id: videoInfo[0].id!, 
            startTime: videoInfo[0].liveStreamingDetails!.scheduledStartTime!
        }
    }
}