var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AdminPage } from "./AdminPage.js";
import { Base } from "./Base.js";
import { LoginPage } from "./LoginPage.js";
export class PageManager extends Base {
    constructor(client) {
        super(client);
        this.cache = new Map;
    }
    load(page) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.client.node.firstChild)
                this.client.node.firstChild.remove();
            yield page.init();
        });
    }
    get adminPage() {
        const page = new AdminPage(this.client, 'admin_console');
        this.cache.set('admin_console', page);
        return page;
    }
    get loginPage() {
        const page = new LoginPage(this.client);
        this.cache.set('console_login', page);
        return page;
    }
}
//# sourceMappingURL=PageManager.js.map