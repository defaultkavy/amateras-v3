import { Base } from "./Base.js";
export class _Guild extends Base {
    constructor(client, data) {
        super(client);
        this.id = data.id;
        this.name = data.name;
        this.channels = data.channels;
        this.categories = data.categories;
        this.threads = data.threads;
        this.emojis = data.emojis;
        this.access = data.access;
        this.members = data.members;
        this.roles = data.roles;
    }
}
//# sourceMappingURL=_Guild.js.map