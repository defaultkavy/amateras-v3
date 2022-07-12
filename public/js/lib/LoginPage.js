var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Page } from "./Page.js";
export class LoginPage extends Page {
    constructor(client) {
        super(client, 'console_login');
        this.usernameInput = document.createElement('input');
        this.passwordInput = document.createElement('input');
        this.passwordInput.type = 'password';
        this.loginButton = document.createElement('button');
        this.loginButton.innerText = 'Login';
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.layout();
            this.eventHandler();
            this.load();
        });
    }
    eventHandler() {
        this.passwordInput.addEventListener('keyup', (ev) => {
            if (ev.key === 'Enter') {
                this.login();
            }
        });
        this.loginButton.addEventListener('click', (ev) => {
            this.login();
        });
    }
    login() {
        return __awaiter(this, void 0, void 0, function* () {
            const acc = {
                username: this.usernameInput.value,
                password: this.passwordInput.value
            };
            const result = yield this.client.server.post(this.client.origin + '/login', acc);
            this.loginButton.innerText = result;
            if (result === 'Login successful') {
                const data = yield this.client.discordData();
                this.client.role = data.role;
                this.client.pages.load(this.client.pages.adminPage);
            }
            else
                setTimeout(() => { this.loginButton.innerText = 'Login'; }, 2000);
        });
    }
    layout() {
        this.node.appendChild(this.client.createTitle('username'));
        this.node.appendChild(this.usernameInput);
        this.node.appendChild(this.client.createTitle('password'));
        this.node.appendChild(this.passwordInput);
        this.node.appendChild(this.loginButton);
    }
}
//# sourceMappingURL=LoginPage.js.map