import { BasePageElement } from "./BasePageElement";
import { Client } from "./Client";
import { Page } from "./Page";

export class _ReplyInput extends BasePageElement {
    constructor(client: Client, page: Page, node: HTMLElement) {
        super(client, page, node)
    }
}