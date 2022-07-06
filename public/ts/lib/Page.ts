import { Base } from "./Base.js";
import { Client } from "./Client.js";

export class Page extends Base {
    node: HTMLElement;
    id: string
    constructor(client: Client, id: string) {
        super(client)
        this.id = id
        this.node = document.createElement('app-page')
        this.node.id = id
    }

    async init() {}

    load() {
        this.client.node.appendChild(this.node)
    }
}