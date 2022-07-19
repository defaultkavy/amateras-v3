import { MessageOptions, NewsChannel, PrivateThreadChannel, PublicThreadChannel, TextChannel, ThreadChannel } from "discord.js";
import { Amateras } from "./Amateras";
import { _GuildChannel } from "./_GuildChannel";
import { _Guild } from "./_Guild";
import { _Hint, _HintInfo } from "./_Hint";

export class _TextBaseChannel extends _GuildChannel {
    origin: TextChannel | PublicThreadChannel | PrivateThreadChannel | NewsChannel;
    hint?: _Hint;
    constructor(amateras: Amateras, _guild: _Guild, channel: TextChannel | PublicThreadChannel | PrivateThreadChannel | NewsChannel) {
        super(amateras, _guild, channel)
        this.origin = channel
    }

    async init() {
        this.origin.messages.fetch({limit: 100})
    }

    async enableHint(info: _HintInfo) {
        this.hint = new _Hint(this.amateras, this._guild, this, info)
        await this.hint.save()
        await this._guild.save()
        return this.hint
    }

    async disableHint() {
        if (!this.hint) return 'Hint function no enabled'
        await this.hint.delete()
        this.hint = undefined
        await this._guild.save()
        return 'Hint function turn off'
    }

    async send(messageOption: MessageOptions) {
        const message = await this.origin.send(messageOption).catch(err => this.amateras.system.log(err))
        return message
    }
}