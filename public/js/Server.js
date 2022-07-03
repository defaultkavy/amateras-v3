var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Base } from "./Base.js";
export class Server extends Base {
    constructor(client) {
        super(client);
    }
    connect(url) {
        return __awaiter(this, void 0, void 0, function* () {
            this.source = new EventSource(url);
        });
    }
    onmessage(fn) {
        if (!this.source)
            return;
        this.source.addEventListener('message', (ev) => {
            const data = JSON.parse(ev.data);
            fn(data);
        });
    }
    post(host, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var xhttp = new XMLHttpRequest();
            return new Promise(resolve => {
                xhttp.onreadystatechange = function () {
                    if (this.status === 404) {
                    }
                    if (this.readyState === 4 && this.status == 200) {
                        resolve(this.responseText);
                    }
                };
                xhttp.open("POST", host, true);
                xhttp.setRequestHeader("Content-Type", "application/json");
                xhttp.send(JSON.stringify(data));
            });
        });
    }
}
//# sourceMappingURL=Server.js.map