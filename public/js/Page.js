import { Base } from "./Base";
export class Page extends Base {
    constructor(client) {
        super(client);
        this.node = document.createElement('app-page');
    }
    load() {
        this.client.node.appendChild(this.node);
    }
}
//# sourceMappingURL=Page.js.map