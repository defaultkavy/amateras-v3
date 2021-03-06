"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._Interaction = void 0;
const _Base_1 = require("./_Base");
class _Interaction extends _Base_1._Base {
    constructor(amateras, interaction, _user) {
        super(amateras);
        this.valid = false;
        this.origin = interaction;
        this._user = _user;
    }
    isValid() {
        const _guild = this.amateras.guilds.cache.get(this.origin.guild.id);
        if (!_guild)
            return false;
        this._guild = _guild;
        this.member = this._guild.origin.members.cache.get(this._user.id);
        if (!this.member)
            return false;
        if (!this.origin.channel)
            return false;
        const _channel = this._guild.channels.cache.get(this.origin.channel.id);
        if (!_channel || !_channel.isTextBased())
            return false;
        this._channel = _channel;
        return true;
    }
}
exports._Interaction = _Interaction;
//# sourceMappingURL=_Interaction.js.map