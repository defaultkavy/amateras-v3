import { Base } from "./Base.js";
export class BasePageElement extends Base {
    constructor(client, page, node) {
        super(client);
        this.page = page;
        this.node = node;
    }
    clearChild() {
        while (this.node.firstChild) {
            this.node.removeChild(this.node.firstChild);
        }
    }
}
//# sourceMappingURL=BasePageElement.js.map