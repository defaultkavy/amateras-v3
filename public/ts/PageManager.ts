import { AdminPage } from "./AdminPage";
import { Base } from "./Base";
import { Client } from "./Client";
import { Page } from "./Page";

export class PageManager extends Base {
    cache: Map<string, Page>;
    constructor(client: Client) {
        super(client)
        this.cache = new Map
    }
    
    loadAdminPage() {
        const page = new AdminPage(this.client)
        this.cache.set('login', page)
        return page
    }
}