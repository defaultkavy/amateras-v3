import { PageManager } from "./PageManager";

export class Client {
    node: HTMLElement;
    pages: PageManager;
    constructor() {
        this.node = document.createElement('app')
        this.pages = new PageManager(this)

        this.init()
    }

    async init() {
        this.pages.loadAdminPage()
    }
}