import { BasePageElement } from "./BasePageElement.js";
import { _MessageEmbed } from "./_MessageEmbed.js";
export class MessageBox extends BasePageElement {
    constructor(client, page, node, data) {
        super(client, page, node);
        this.page = page;
        this.data = data;
        this.embeds = new Map;
        this.author = document.createElement('author');
        this.content = document.createElement('message-content');
        this.sticker = document.createElement('sticker');
        this.attachments = document.createElement('attachments');
        this.avatar = document.createElement('img');
        this.init();
    }
    init() {
        this.author.innerText = this.data.author.name;
        this.avatar.src = this.data.author.avatar;
        if (this.data.sticker)
            this.sticker.innerText = this.data.sticker;
        for (const attachment of this.data.attachments) {
            const attachmentBox = document.createElement('attachment');
            if (checkImage(attachment.type)) {
                const img = document.createElement('img');
                img.src = attachment.url;
                attachmentBox.classList.add('image');
                attachmentBox.appendChild(img);
            }
            else {
                attachmentBox.classList.add('unknown');
                attachmentBox.innerText = attachment.type ? attachment.type : 'Unknown File';
            }
            attachmentBox.addEventListener('click', (ev) => {
                window.open(attachment.url, '_Blank');
            });
            this.attachments.appendChild(attachmentBox);
        }
        for (const embed of this.data.embeds) {
            const embedBox = new _MessageEmbed(this.client, this, embed, document.createElement('object-embed'));
            this.embeds.set(+new Date, embedBox);
        }
        let text = this.data.content;
        // replace new line
        text = text.replace(/\n/g, '<br>');
        text = this.replaceLink(text);
        text = this.replaceEmoji(text);
        this.content.innerHTML = text;
        this.emojiInit();
        this.eventHandler();
        this.layout();
        function checkImage(type) {
            if (type === 'image/jpeg' || type === 'image/png')
                return true;
            return false;
        }
    }
    layout() {
        const avatarWrapper = document.createElement('avatar');
        avatarWrapper.appendChild(this.avatar);
        const contentWrapper = document.createElement('content-wrapper');
        const lastMessage = Array.from(this.page.messages.cache.values()).pop();
        if (lastMessage) {
            if (this.data.author.id !== lastMessage.data.author.id) {
                addUpper.call(this);
            }
            else {
                if (this.data.timestamps - lastMessage.data.timestamps > 1000 * 60 * 10) {
                    addUpper.call(this);
                }
                else {
                    const span = document.createElement('span');
                    span.classList.add('timestamp');
                    this.node.appendChild(span);
                }
            }
        }
        function addUpper() {
            const upperWrapper = document.createElement('upper-wrapper');
            upperWrapper.appendChild(this.author);
            this.node.appendChild(avatarWrapper);
            contentWrapper.appendChild(upperWrapper);
            this.node.classList.add('first');
        }
        if (this.data.sticker) {
            contentWrapper.appendChild(this.sticker);
        }
        else {
            contentWrapper.appendChild(this.content);
        }
        for (const embedBox of this.embeds.values()) {
            contentWrapper.append(embedBox.node);
        }
        contentWrapper.appendChild(this.attachments);
        this.node.appendChild(contentWrapper);
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
    emojiInit() {
        const emojis = document.querySelectorAll('.emoji');
        for (const emoji of emojis) {
            const img = document.createElement('img');
            img.src = this.page;
        }
    }
    replaceLink(text) {
        const regex = /https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}/;
        const matches = this.data.content.match(regex);
        if (matches) {
            for (const url of matches) {
                text = text.replace(url, `<a target="_Blank" href="${url}">${url}</a>`);
            }
        }
        return text;
    }
    replaceEmoji(text) {
        const regex = /<:[\d\w]+:[0-9]+>/;
        const matches = this.data.content.match(regex);
        if (matches) {
            for (const match of matches) {
                const id = match.match(/\d+(?=>)/);
                if (!id)
                    continue;
                text = text.replace(match, `<span class="emoji" data-id="${id}"></span>`);
            }
        }
        return text;
    }
}
//# sourceMappingURL=_MessageBox.js.map