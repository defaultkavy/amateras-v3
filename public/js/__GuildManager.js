import { __Guild } from "./__Guild.js";
export class __GuildManager {
    constructor(guilds) {
        this.data = guilds;
        this.cache = new Map;
    }
    init() {
        for (const guild of this.data) {
            this.cache.set(guild.id, new __Guild(guild));
        }
    }
}
//# sourceMappingURL=__GuildManager.js.map