"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._GuildCommand = void 0;
const tools_1 = require("../plugins/tools");
const _BaseGuildObjDB_1 = require("./_BaseGuildObjDB");
class _GuildCommand extends _BaseGuildObjDB_1._BaseGuildObjDB {
    constructor(amateras, _guild, info) {
        super(amateras, _guild, info, amateras.db.collection('guild_commands'));
        this.name = info.name;
        this.limitedChannels = info.limitedChannels;
    }
    addChannel(channelId) {
        this.limitedChannels.push(channelId);
        this.save();
    }
    removeChannel(channelId) {
        this.limitedChannels = (0, tools_1.removeArrayItem)(this.limitedChannels, channelId);
        this.save();
    }
}
exports._GuildCommand = _GuildCommand;
//# sourceMappingURL=_GuildCommand.js.map