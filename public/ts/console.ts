import { Client } from "./lib/Client.js";
window.client = new Client()
document.body.style.backgroundColor = '#36393f'

declare global {
    var client: Client
}