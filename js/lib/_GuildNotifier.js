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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __GuildNotifier_videosSent;
Object.defineProperty(exports, "__esModule", { value: true });
exports._GuildNotifier = void 0;
const discord_js_1 = require("discord.js");
const tools_1 = require("../plugins/tools");
const _BaseGuildObj_1 = require("./_BaseGuildObj");
class _GuildNotifier extends _BaseGuildObj_1._BaseGuildObj {
    constructor(amateras, _guild, info) {
        super(amateras, _guild, info, _guild.notifiers.collection, ['_channel', 'role', 'videosSent']);
        __GuildNotifier_videosSent.set(this, void 0);
        this.id = info.id;
        this.message = info.message;
        this.roleId = info.roleId;
        this.role = info.roleId ? _guild.origin.roles.cache.get(info.roleId) : undefined;
        this._channel = info._channel;
        this.channelId = info._channel.id;
        this.videosSent = new Map;
        __classPrivateFieldSet(this, __GuildNotifier_videosSent, info.videosSent, "f");
        this.init();
    }
    init() {
        for (const videoId of __classPrivateFieldGet(this, __GuildNotifier_videosSent, "f"))
            this.videosSent.set(videoId, videoId);
    }
    send(videoInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.videosSent.has(videoInfo.id))
                return;
            const time = new Date(videoInfo.startTime);
            const embed = {
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
                    url: videoInfo.thumbnails ? videoInfo.thumbnails.maxres.url : undefined,
                },
                description: videoInfo.description ? (0, tools_1.wordCounter)(videoInfo.description, 100, 1) : undefined,
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
            };
            yield this._channel.origin.send({
                content: this.role || this.message ? `${this.role ? this.role : ''}${this.role ? ' - ' : ''}${this.message ? this.message : ''}` : undefined,
                embeds: [embed]
            });
            this.videosSent.set(videoInfo.id, videoInfo.id);
            this.save();
        });
    }
    embed() {
        return __awaiter(this, void 0, void 0, function* () {
            const _notifier = this.amateras.notifiers.cache.get(this.id);
            if (!_notifier)
                return console.debug(1);
            const channelInfo = yield _notifier.fetchChannel();
            if (!channelInfo)
                return console.debug(2);
            return {
                title: channelInfo[0].snippet.title,
                thumbnail: {
                    url: channelInfo[0].snippet.thumbnails.high.url,
                },
                description: (0, tools_1.wordCounter)(channelInfo[0].snippet.description, 200),
                footer: {
                    text: 'YouTube',
                    iconURL: 'https://www.youtube.com/s/desktop/a14aba22/img/favicon_32x32.png'
                },
                color: 'RED',
            };
        });
    }
    get components() {
        const row = new discord_js_1.MessageActionRow;
        row.addComponents({
            customId: 'subscribeButton',
            style: 'PRIMARY',
            label: '打开通知',
            type: 'BUTTON'
        });
        row.addComponents({
            customId: 'unsubscribeButton',
            style: 'DANGER',
            label: '关闭通知',
            type: 'BUTTON'
        });
        return row;
    }
    presave() {
        return {
            videosSent: Array.from(this.videosSent.keys())
        };
    }
}
exports._GuildNotifier = _GuildNotifier;
__GuildNotifier_videosSent = new WeakMap();
//# sourceMappingURL=_GuildNotifier.js.map