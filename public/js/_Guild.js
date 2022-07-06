import { Base } from "./Base.js";
export class _Guild extends Base {
    constructor(client, data) {
        super(client);
        this.channels = data.channels;
        this.categories = data.categories;
        this.emojis = data.emojis;
    }
}
//# sourceMappingURL=_Guild.js.map