import { GuildMember, Interaction } from "discord.js";
import { Amateras } from "./Amateras";
import { _Base } from "./_Base";
import { _Guild } from "./_Guild";
import { _TextBaseChannel } from "./_TextBaseChannel";
import { _TextChannel } from "./_TextChannel";
import { _ThreadChannel } from "./_ThreadChannel";
import { _User } from "./_User";

export class _Interaction extends _Base {
    origin: Interaction<'cached'>;
    _user: _User;
    _guild?: _Guild;
    _channel?: _TextBaseChannel;
    member?: GuildMember;
    valid = false
    constructor(amateras: Amateras, interaction: Interaction<'cached'>, _user: _User) {
        super(amateras)
        this.origin = interaction
        this._user = _user
    }

    isValid(): this is _ValidInteraction {
        const _guild = this.amateras.guilds.cache.get(this.origin.guild.id)
        if (!_guild) return false
        this._guild = _guild
        this.member = this._guild.origin.members.cache.get(this._user.id)
        if (!this.member) return false
        if (!this.origin.channel) return false
        const _channel = this._guild.channels.cache.get(this.origin.channel.id)
        if (!_channel || !_channel.isTextBased()) return false
        this._channel = _channel
        return true
    }
}

export interface _ValidInteraction extends _Interaction {
    _guild: _Guild;
    _channel: _TextBaseChannel;
    member: GuildMember;
    valid: true
}