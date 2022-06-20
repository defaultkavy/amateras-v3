import { ButtonInteraction, CommandInteraction, Guild, Interaction } from "discord.js";
import { Amateras } from "./Amateras";
import { _Base } from "./_Base";
import { _Guild } from "./_Guild";
import { _TextChannel } from "./_TextChannel";
import { _ThreadChannel } from "./_ThreadChannel";
import { _User } from "./_User";

export class _Interaction extends _Base {
    origin: CommandInteraction | ButtonInteraction;
    _user: _User;
    _guild?: _Guild;
    _channel?: _TextChannel | _ThreadChannel;
    valid = false
    constructor(amateras: Amateras, interaction: CommandInteraction | ButtonInteraction, _user: _User) {
        super(amateras)
        this.origin = interaction
        this._user = _user
    }

    isValid(): this is _ValidInteraction {
        if (!this.origin.guild) return false
        const _guild = this.amateras.guilds.cache.get(this.origin.guild.id)
        if (!_guild) return false
        this._guild = _guild
        if (!this.origin.channel) return false
        const _channel = this._guild.channels.cache.get(this.origin.channel.id)
        if (!_channel || !(_channel.isTextBased())) return false
        this._channel = _channel
        return true
    }
}

export interface _ValidInteraction extends _Interaction {
    _guild: _Guild;
    _channel: _TextChannel | _ThreadChannel;
    valid: true
}