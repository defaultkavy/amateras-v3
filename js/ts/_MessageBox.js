import { BasePageElement } from "./BasePageElement.js";
export class _MessageBox extends BasePageElement {
    constructor(client, page, node, data) {
        super(client, page, node);
        this.page = page;
        this.data = data;
        this.author = document.createElement('author');
        this.content = document.createElement('message-content');
        this.sticker = document.createElement('sticker');
        this.attachments = document.createElement('attachments');
        this.avatar = document.createElement('img');
        this.init();
    }
    init() {
        this.author.innerText = this.data.author.name;
        this.content.innerText = this.data.content;
        this.avatar.src = this.data.avatar;
        this.node.appendChild(this.author);
        if (this.data.sticker) {
            this.sticker.innerText = this.data.sticker;
            this.node.appendChild(this.sticker);
        }
        else {
            this.node.appendChild(this.content);
        }
        for (const attachment of this.data.attachments) {
            const attachmentBox = document.createElement('attachment');
            attachmentBox.innerText = attachment.type ? attachment.type : 'Unknown File';
            attachmentBox.addEventListener('click', (ev) => {
                window.open(attachment.url, '_Blank');
            });
            this.attachments.appendChild(attachmentBox);
        }
        for (const embed of this.data.embeds) {
            const embedBox = document.createElement('object-embed');
            embedBox.innerText = 'object/embed';
            this.node.appendChild(embedBox);
        }
        this.node.appendChild(this.attachments);
        this.eventHandler();
    }
    eventHandler() {
        this.node.addEventListener('mouseenter', (ev) => {
            const replyButton = document.createElement('reply-button');
            replyButton.innerText = 'Reply';
            this.node.appendChild(replyButton);
            replyButton.addEventListener('click', (ev) => {
                this.page.reply.node.value = this.data.url;
                this.page.reply.check();
            });
            this.node.addEventListener('mouseleave', (ev) => {
                replyButton.remove();
            });
        });
    }
}
//# sourceMappingURL=_MessageBox.js.map