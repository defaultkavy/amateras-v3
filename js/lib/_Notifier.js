"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._Notifier = void 0;
const _Base_1 = require("./_Base");
class _Notifier extends _Base_1._Base {
    constructor(amateras, info) {
        super(amateras);
        this.id = info.id;
        this.timer = null;
        this.videosCache = new Map;
        this.subscribed = new Map;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.get();
            this.timer = setInterval(this.get.bind(this), 300 * 1000);
        });
    }
    subscribe(_guild) {
        this.subscribed.set(_guild.id, _guild);
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const videoId = yield this.amateras.system.youtube.fetchStream(this.id);
            if (!videoId)
                return;
            const cached = this.videosCache.get(videoId);
            if (cached)
                return cached;
            const videoInfo = yield this.amateras.system.youtube.fetchVideo(videoId);
            if (!videoInfo)
                return;
            const channelInfo = yield this.amateras.system.youtube.fetchChannel(this.id);
            if (!channelInfo)
                return;
            if (!channelInfo || !channelInfo[0] || !channelInfo[0].snippet)
                return;
            const youtubeInfo = Object.assign(Object.assign({}, videoInfo), { channelThumbnailURL: channelInfo[0].snippet.thumbnails.high.url });
            for (const _guild of this.subscribed.values()) {
                const _guildNotifier = _guild.notifiers.cache.get(this.id);
                if (!_guildNotifier)
                    continue;
                _guildNotifier.send(youtubeInfo);
            }
            this.videosCache.set(videoInfo.id, youtubeInfo);
        });
    }
}
exports._Notifier = _Notifier;
//# sourceMappingURL=_Notifier.js.map