import { PageManager } from "./PageManager.js";
import { Server } from "./Server.js";
import { ConsoleGuildData } from "./_Guild.js";
import { _GuildManager } from "./_GuildManager.js";

export class Client {
    node: HTMLElement;
    pages: PageManager;
    server: Server;
    origin: string;
    guilds: _GuildManager;
    constructor() {
        this.node = document.createElement('app')
        document.body.appendChild(this.node)
        this.pages = new PageManager(this)
        this.server = new Server(this)
        this.origin = window.location.protocol + '//' +  window.location.host + '/v3'
        this.guilds = new _GuildManager(this)
        this.init()
    }

    async init() {
        const session = await this.server.post(this.origin + '/session', {})
        if (session === 'false') {
            this.pages.load(this.pages.loginPage)
        }
        else {
            this.guilds.init((await this.discordData()).guilds)
            this.pages.load(this.pages.adminPage)
        }
    }

    async discordData() {
        return await (await fetch(this.origin + '/console')).json() as ConsoleData
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

export interface ConsoleData {
    guilds: ConsoleGuildData[],
    success: boolean
}