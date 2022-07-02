import { AdminPage } from "./AdminPage";
import { Base } from "./Base";
export class PageManager extends Base {
    constructor(client) {
        super(client);
        this.cache = new Map;
    }
    loadAdminPage() {
        const page = new AdminPage(this.client);
        this.cache.set('login', page);
        return page;
    }
}
//# sourceMappingURL=PageManager.js.map