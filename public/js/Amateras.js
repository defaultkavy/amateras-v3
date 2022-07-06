import { Base } from "./Base.js";
import { _GuildManager } from "./_GuildManager.js";
export class Amateras extends Base {
    constructor(client) {
        super(client);
        this.guilds = new _GuildManager(this, client);
    }
}
//# sourceMappingURL=Amateras.js.map