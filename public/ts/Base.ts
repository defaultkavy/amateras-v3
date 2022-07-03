import { Client } from "./Client.js";

export class Base {
    client: Client;
    constructor(client: Client) {
        this.client = client
    }
}