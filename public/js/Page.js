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
export class Page extends Base {
    constructor(client, id) {
        super(client);
        this.id = id;
        this.node = document.createElement('app-page');
        this.node.id = id;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    load() {
        this.client.node.appendChild(this.node);
    }
}
//# sourceMappingURL=Page.js.map