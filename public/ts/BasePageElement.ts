import { Base } from "./Base";
import { Client } from "./Client";
import { Page } from "./Page";

export class BasePageElement extends Base {
    page: Page;
    node: HTMLElement;
    constructor(client: Client, page: Page, node: HTMLElement) {
        super(client)
        this.page = page
        this.node = node
    }
}