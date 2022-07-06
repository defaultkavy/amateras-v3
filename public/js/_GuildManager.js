import { Base } from "./Base.js";
import { _Guild } from "./_Guild.js";
export class _GuildManager extends Base {
    constructor(client) {
        super(client);
        this.cache = new Map;
    }
    init(data) {
        for (const guild of data) {
            this.cache.set(guild.id, new _Guild(this.client, guild));
        }
    }
}
//# sourceMappingURL=_GuildManager.js.map