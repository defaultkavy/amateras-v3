var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PageManager } from "./PageManager.js";
import { Server } from "./Server.js";
import { _GuildManager } from "./_GuildManager.js";
export class Client {
    constructor() {
        this.node = document.createElement('app');
        document.body.appendChild(this.node);
        this.pages = new PageManager(this);
        this.server = new Server(this);
        this.origin = window.location.protocol + '//' + window.location.host + '/v3';
        this.guilds = new _GuildManager(this);
        this.npcs = new Map;
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield this.server.post(this.origin + '/session', {});
            if (session === 'false') {
                this.pages.load(this.pages.loginPage);
            }
            else {
                const data = yield this.discordData();
                this.role = data.role;
                this.pages.load(this.pages.adminPage);
            }
        });
    }
    discordData() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (yield fetch(this.origin + '/console')).json();
            this.guilds.init(data.guilds);
            if (data.npcs) {
                for (const npc of data.npcs) {
                    this.npcs.set(npc.id, npc);
                }
            }
            return data;
        });
    }
    createTitle(title) {
        const span = document.createElement('span');
        span.innerText = title;
        return span;
    }
    createDiv(classname) {
        const div = document.createElement('div');
        div.className = classname;
        return div;
    }
}
//# sourceMappingURL=Client.js.map