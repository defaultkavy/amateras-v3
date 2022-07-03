import { BasePageElement } from "./BasePageElement.js";
export class _ReplyInput extends BasePageElement {
    constructor(client, page, node) {
        super(client, page, node);
        this.node = node;
        this.trigger = false;
        this.node.id = 'reply';
    }
    clear() {
        this.node.value = '';
        this.check();
    }
    check() {
        if (this.node.value !== '') {
            if (!this.node.value.match(/(https?:\/\/)?(www\.)?(discord.com)\/channels\/[0-9]\d+\/[0-9]\d+\/[0-9]\d+/)) {
                this.node.style.borderColor = '#ff0000';
                this.trigger = false;
            }
            else {
                this.node.style.borderColor = 'lime';
                this.trigger = true;
            }
        }
        else {
            this.node.style.borderColor = 'grey';
            this.trigger = false;
        }
    }
}
//# sourceMappingURL=_ReplyInput.js.map