import { BasePageElement } from "./BasePageElement.js";
import { Client } from "./Client.js";
import { Page } from "./Page.js";

export class _Selector extends BasePageElement {
    id: string;
    node: HTMLSelectElement;
    constructor(client: Client, page: Page, node: HTMLSelectElement, id: string) {
        super(client, page, node)
        this.node = node
        this.id = id
        this.node.id = id
    }

    addOption(content: string, value: string) {
        const option = document.createElement('option')
        option.innerText = content
        option.value = value
        this.node.appendChild(option)
    }

    clearOptions() {
        while (this.node.firstChild) {
            this.node.removeChild(this.node.firstChild)
        }
    }
}