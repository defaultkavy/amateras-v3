var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BasePageElement } from "./BasePageElement.js";
import { MessageChannel } from "./MessageChannel.js";
export class MessageChannelManager extends BasePageElement {
    constructor(client, page, node) {
        super(client, page, node);
        this.page = page;
        this.cache = new Map;
        this.channel = undefined;
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            // check channel is same
            if (this.channel && this.page.channelId === this.channel.id) {
                yield this.channel.contentInit();
                this.channel.scrollBottom();
                return;
            }
            //
            const guild = this.client.guilds.cache.get(this.page.guildId);
            if (!guild)
                return;
            this.clearChild();
            // check channel is exist
            const get = this.cache.get(this.page.channelId);
            if (get) {
                yield get.contentInit();
                this.node.appendChild(get.node);
                this.channel = get;
                this.channel.scrollBottom(true);
                return;
            }
            //
            const channel = new MessageChannel(this.client, this.page, guild, this.page.channelId, document.createElement('message-channel'));
            this.cache.set(this.page.channelId, channel);
            yield channel.init();
            this.node.appendChild(channel.node);
            this.channel = channel;
            this.channel.scrollBottom(true);
            return channel;
        });
    }
}
//# sourceMappingURL=MessageChannelManager.js.map