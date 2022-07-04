import { PageManager } from "./PageManager.js";
import { Server } from "./Server.js";

export class Client {
    node: HTMLElement;
    pages: PageManager;
    server: Server;
    origin: string;
    constructor() {
        this.node = document.createElement('app')
        document.body.appendChild(this.node)
        this.pages = new PageManager(this)
        this.server = new Server(this)
        this.origin = window.location.protocol + '//' +  window.location.host + '/v3'
        this.init()
    }

    async init() {
        const session = await this.server.post(this.origin + '/session', {})
        if (session === 'false') {
            this.pages.load(this.pages.loginPage)
        }
        else this.pages.load(this.pages.adminPage)
    }

    createTitle(title: string) {
        const span = document.createElement('span')
        span.innerText = title
        return span
    }

    createDiv(classname: string) {
        const div = document.createElement('div')
        div.className = classname
        return div
    }
}