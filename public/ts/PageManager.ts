import { AdminPage } from "./AdminPage.js";
import { Base } from "./Base.js";
import { Client } from "./Client.js";
import { LoginPage } from "./LoginPage.js";
import { Page } from "./Page.js";


export class PageManager extends Base {
    cache: Map<string, Page>;
    constructor(client: Client) {
        super(client)
        this.cache = new Map
    }

    async load(page: Page) {
        if (this.client.node.firstChild) this.client.node.firstChild.remove()
        await page.init()
    }
    
    get adminPage() {
        const page = new AdminPage(this.client, 'admin_console')
        this.cache.set('admin_console', page)
        return page
    }

    get loginPage() {
        const page = new LoginPage(this.client)
        this.cache.set('console_login', page)
        return page
    }
}