import { Base } from "./Base.js";
import { Client } from "./Client.js";
import { Page } from "./Page.js";


export class BasePageElement extends Base {
    page: Page;
    node: HTMLElement;
    constructor(client: Client, page: Page, node: HTMLElement) {
        super(client)
        this.page = page
        this.node = node
    }

    clearChild() {
        while (this.node.firstChild) {
            this.node.removeChild(this.node.firstChild)
        }
    }
}