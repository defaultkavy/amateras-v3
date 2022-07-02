import { Base } from "./Base";
import { Client } from "./Client";

export class Page extends Base {
    node: HTMLElement;
    constructor(client: Client) {
        super(client)
        this.node = document.createElement('app-page')
    }

    load() {
        this.client.node.appendChild(this.node)
    }
}