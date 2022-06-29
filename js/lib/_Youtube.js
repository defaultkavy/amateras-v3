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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._Youtube = void 0;
const googleapis_1 = require("googleapis");
const request_promise_1 = __importDefault(require("request-promise"));
const cheerio_1 = __importDefault(require("cheerio"));
const _Base_1 = require("./_Base");
class _Youtube extends _Base_1._Base {
    constructor(amateras) {
        super(amateras);
        this.api = googleapis_1.google.youtube({
            version: 'v3',
            // @ts-ignore
            auth: this.amateras.config.youtube.api_key
        });
    }
    fetchChannel(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = yield this.amateras.system.youtube.api.channels.list({
                id: [id],
                part: ['snippet,contentDetails,statistics']
            }).catch(() => undefined);
            if (!channel)
                return;
            return channel.data.items;
        });
    }
    fetchStream(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, request_promise_1.default)(`https://www.youtube.com/channel/${channelId}/live`).then((html) => __awaiter(this, void 0, void 0, function* () {
                for (const ele of (0, cheerio_1.default)('link', html)) {
                    if (ele.attribs.rel === 'canonical')
                        return ele.attribs.href.slice(ele.attribs.href.length - 11, ele.attribs.href.length);
                }
            }));
        });
    }
    fetchVideo(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const videoInfo = yield this.amateras.system.youtube.api.videos.list({
                id: [id],
                part: ['snippet,contentDetails,statistics,liveStreamingDetails']
            }).then((res) => res.data.items);
            if (!videoInfo || !videoInfo[0] || !videoInfo[0].snippet)
                return;
            return Object.assign(Object.assign({}, videoInfo[0].snippet), { id: videoInfo[0].id, startTime: videoInfo[0].liveStreamingDetails.scheduledStartTime });
        });
    }
}
exports._Youtube = _Youtube;
//# sourceMappingURL=_Youtube.js.map