import { Client } from "./Client.js";
import { Page } from "./Page.js";

export class LoginPage extends Page {
    usernameInput: HTMLInputElement;
    passwordInput: HTMLInputElement;
    loginButton: HTMLButtonElement;
    constructor(client: Client) {
        super(client, 'console_login')
        this.usernameInput = document.createElement('input')
        this.passwordInput = document.createElement('input')
        this.passwordInput.type = 'password'
        this.loginButton = document.createElement('button')
        this.loginButton.innerText = 'Login'
    }

    async init() {
        this.layout()
        this.eventHandler()
        this.load()
    }

    eventHandler() {
        this.passwordInput.addEventListener('keyup', (ev) => {
            if (ev.key === 'Enter') {
                this.login()
            }
        })

        this.loginButton.addEventListener('click', (ev) => {
            this.login()
        })

    }

    async login() {
        const acc = {
            username: this.usernameInput.value,
            password: this.passwordInput.value
        }

        const result = await this.client.server.post(this.client.origin + '/login', acc) as string
        this.loginButton.innerText = result
        if (result === 'Login successful') {
            const data = await this.client.discordData()
            this.client.role = data.role
            this.client.pages.load(this.client.pages.adminPage)
        } else
        setTimeout(() => {this.loginButton.innerText = 'Login'}, 2000)
    }

    private layout() {
        this.node.appendChild(this.client.createTitle('username'))
        this.node.appendChild(this.usernameInput)
        this.node.appendChild(this.client.createTitle('password'))
        this.node.appendChild(this.passwordInput)
        this.node.appendChild(this.loginButton)

    }
}