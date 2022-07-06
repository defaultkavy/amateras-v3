import { Base } from "./Base.js";
import { Client } from "./Client.js";

export class Server extends Base {
    source: EventSource | undefined
    constructor(client: Client) {
        super(client)
    }

    async connect(url: string) {
        this.source = new EventSource(url)
    }

    onmessage(fn: (data: any) => void) {
        if (!this.source) return
        this.source.addEventListener('message', (ev) => {
            const data = JSON.parse(ev.data)
            fn(data)
        })
    }

    async post(host: string, data: {}) {
        var xhttp = new XMLHttpRequest();
        return new Promise(resolve => {
            xhttp.onreadystatechange = function() {
                if (this.status === 404) {
                    
                }
                if (this.readyState === 4 && this.status == 200) {
                    resolve(this.responseText);
                }
            };
            xhttp.open("POST", host, true);
            xhttp.setRequestHeader("Content-Type", "application/json");
            xhttp.send(JSON.stringify(data));
        })
    }
}