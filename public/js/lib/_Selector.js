import { BasePageElement } from "./BasePageElement.js";
export class _Selector extends BasePageElement {
    constructor(client, page, node, id) {
        super(client, page, node);
        this.node = node;
        this.id = id;
        this.node.id = id;
    }
    addOption(content, value) {
        const option = document.createElement('option');
        option.innerText = content;
        option.value = value;
        this.node.appendChild(option);
    }
    clearOptions() {
        while (this.node.firstChild) {
            this.node.removeChild(this.node.firstChild);
        }
    }
}
//# sourceMappingURL=_Selector.js.map