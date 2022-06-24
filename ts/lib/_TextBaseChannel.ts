import { NewsChannel, TextChannel, ThreadChannel, ThreadChannelTypes } from "discord.js";
import { Amateras } from "./Amateras";
import { _GuildChannel } from "./_BaseGuildChannel";
import { _Guild } from "./_Guild";
import { _Hint, _HintInfo } from "./_Hint";

export class _TextBaseChannel extends _GuildChannel {
    origin: TextChannel | ThreadChannel | NewsChannel;
    hint?: _Hint;
    constructor(amateras: Amateras, _guild: _Guild, channel: TextChannel | ThreadChannel | NewsChannel) {
        super(amateras, _guild, channel)
        this.origin = channel
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
}