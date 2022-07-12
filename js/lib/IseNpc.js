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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _IseNpc_webhooks;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IseNpc = void 0;
const request_promise_1 = __importDefault(require("request-promise"));
const _BaseObj_js_1 = require("./_BaseObj.js");
const _TextChannel_js_1 = require("./_TextChannel.js");
const _ThreadChannel_js_1 = require("./_ThreadChannel.js");
class IseNpc extends _BaseObj_js_1._BaseObj {
    constructor(amateras, options) {
        super(amateras, options, amateras.db.collection('ise-npc'), ['webhooks']);
        _IseNpc_webhooks.set(this, void 0);
        this.id = options.id;
        this.name = options.name;
        this.avatar = options.avatar;
        this.active = options.active;
        this.webhooks = new Map;
        __classPrivateFieldSet(this, _IseNpc_webhooks, options.webhooks, "f");
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const data of __classPrivateFieldGet(this, _IseNpc_webhooks, "f")) {
                const _guild = this.amateras.guilds.cache.get(data.guildId);
                if (!_guild)
                    continue;
                const _channel = _guild.channels.cache.get(data.channelId);
                if (!_channel || !_channel.isText())
                    return;
                const webhook = _channel.webhooks.cache.get(data.webhookId);
                if (!webhook)
                    return;
                this.webhooks.set(_channel.id, webhook);
            }
        });
    }
    createWebhook(_channel) {
        return __awaiter(this, void 0, void 0, function* () {
            const webhook = yield _channel.webhooks.create(this.name, this.avatar, 'ISE NPC');
            this.webhooks.set(_channel.id, webhook);
            yield this.save();
            return webhook;
        });
    }
    send(_channel, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (_channel instanceof _ThreadChannel_js_1._ThreadChannel) {
                const _guild = this.amateras.guilds.cache.get(_channel._guild.id);
                if (!_guild)
                    return;
                if (!_channel.origin.parentId)
                    return;
                const parentChannel = _guild.channels.cache.get(_channel.origin.parentId);
                if (!(parentChannel instanceof _TextChannel_js_1._TextChannel))
                    return;
                const webhook = this.webhooks.has(parentChannel.id) ? this.webhooks.get(parentChannel.id) : yield this.createWebhook(parentChannel);
                if (!webhook)
                    return this.amateras.system.log('Webhook is undefined');
                console.debug(yield (0, request_promise_1.default)(`https://discord.com/api/webhooks/${webhook.id}/${webhook.token}?thread_id=${_channel.id}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(options)
                }));
                return;
            }
            else {
                const webhook = this.webhooks.has(_channel.id) ? this.webhooks.get(_channel.id) : yield this.createWebhook(_channel);
                if (!webhook)
                    return this.amateras.system.log('Webhook is undefined');
                return yield webhook.send(options);
            }
        });
    }
    presave() {
        return __awaiter(this, void 0, void 0, function* () {
            const webhooks = [];
            for (const webhook of this.webhooks) {
                webhooks.push({
                    guildId: webhook[1].guildId,
                    channelId: webhook[0],
                    webhookId: webhook[1].id
                });
            }
            return {
                webhooks: webhooks
            };
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const webhook of this.webhooks.values()) {
                webhook.delete().catch(err => this.amateras.system.log(err));
            }
            this.active = false;
            this.save();
            return 'NPC Leave';
        });
    }
    embed() {
        return __awaiter(this, void 0, void 0, function* () {
            const embed = {
                author: {
                    name: `${this.name}`
                },
                thumbnail: {
                    url: this.avatar
                },
                image: {
                    url: 'https://cdn.discordapp.com/attachments/804531119394783276/989579863910408202/white.png'
                }
            };
            return embed;
        });
    }
}
exports.IseNpc = IseNpc;
_IseNpc_webhooks = new WeakMap();
//# sourceMappingURL=IseNpc.js.map