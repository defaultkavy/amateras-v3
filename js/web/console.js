"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const module = {};
const originUrl = window.location.protocol + '//' + window.location.host + '/v3';
const sendButton = document.getElementById('send_button');
const replyBox = document.getElementById('reply_box');
const messageInput = document.getElementById('message_box');
const guildSelector = document.getElementById('guild_selector');
const categorySelector = document.getElementById('category_selector');
const channelSelector = document.getElementById('channel_selector');
const statusText = document.getElementById('status');
const messagesWrapper = document.querySelector('messages');
const replyClearButton = document.querySelector('#clear_button');
const app = document.getElementById('amateras_console');
let lastmessage = '';
let reply = false;
document.body.style.backgroundColor = '#36393f';
init();
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        eventHandler();
        yield contentInit();
        connect();
    });
}
function connect() {
    const sse = new EventSource('/stream');
    sse.addEventListener('message', (ev) => {
        const data = JSON.parse(ev.data);
        if (data.type === 'update') {
            messagesWrapperInit();
        }
    });
}
function eventHandler() {
    if (sendButton && messageInput) {
        sendButton.addEventListener('click', send);
    }
    if (guildSelector) {
        guildSelector.addEventListener('change', categoryBoxInit);
    }
    if (categorySelector) {
        categorySelector.addEventListener('change', channelBoxInit);
    }
    if (channelSelector) {
        channelSelector.addEventListener('change', messagesWrapperInit);
    }
    if (messageInput) {
        let virtualKeyboard = false;
        messageInput.addEventListener('focus', (ev) => {
            window.addEventListener('resize', resize);
        });
        messageInput.addEventListener('blur', (ev) => {
            window.removeEventListener('resize', resize);
            virtualKeyboard = false;
        });
        function resize() {
            virtualKeyboard = true;
        }
        messageInput.addEventListener('keyup', (ev) => {
            if (!virtualKeyboard && ev.key === 'Enter') {
                if (!ev.shiftKey)
                    send();
            }
        });
    }
    if (replyBox) {
        replyBox.addEventListener('blur', replyBoxCheck);
    }
    if (replyClearButton) {
        replyClearButton.addEventListener('click', (ev) => {
            replyBox.value = '';
            replyBoxCheck();
        });
    }
}
function replyBoxCheck() {
    if (replyBox.value !== '') {
        if (!replyBox.value.match(/(https?:\/\/)?(www\.)?(discord.com)\/channels\/[0-9]\d+\/[0-9]\d+\/[0-9]\d+/)) {
            replyBox.style.borderColor = '#ff0000';
            reply = false;
        }
        else {
            replyBox.style.borderColor = 'lime';
            reply = true;
        }
    }
    else {
        replyBox.style.borderColor = 'grey';
        reply = false;
    }
}
function getDiscordData() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (yield fetch(originUrl + '/console-data')).json();
    });
}
function getChannelMessages(guildId, channelId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (yield fetch(originUrl + '/console-data' + `/${guildId}/${channelId}/messages`)).json();
    });
}
function contentInit() {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield getDiscordData();
        if (guildSelector && channelSelector) {
            for (const guild of data.guilds) {
                const selectOption = new Option;
                selectOption.value = guild.id;
                selectOption.innerText = guild.name;
                guildSelector.appendChild(selectOption);
                selectOption.addEventListener('select', (ev) => {
                });
            }
        }
        yield categoryBoxInit();
    });
}
function categoryBoxInit() {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield getDiscordData();
        const guild = data.guilds.find(guild => guild.id === guildSelector.selectedOptions[0].value);
        if (!guild)
            return;
        while (categorySelector.firstChild) {
            categorySelector.removeChild(categorySelector.firstChild);
        }
        guild.categories.sort((a, b) => a.position - b.position);
        const selectOption = new Option;
        selectOption.value = 'none';
        selectOption.innerText = 'Uncategory';
        categorySelector.appendChild(selectOption);
        for (const category of guild.categories) {
            const selectOption = new Option;
            selectOption.value = category.id;
            selectOption.innerText = category.name;
            categorySelector.appendChild(selectOption);
        }
        yield channelBoxInit();
    });
}
function channelBoxInit() {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield getDiscordData();
        const guild = data.guilds.find(guild => guild.id === guildSelector.selectedOptions[0].value);
        if (!guild)
            return;
        const channels = guild.channels.filter(channel => {
            if (categorySelector.selectedOptions[0].value === 'none') {
                return !channel.parent;
            }
            else {
                return channel.parent === categorySelector.selectedOptions[0].value;
            }
        });
        channels.sort((a, b) => {
            if (a.position === undefined)
                return -1;
            if (b.position === undefined)
                return 1;
            return a.position - b.position;
        });
        while (channelSelector.firstChild) {
            channelSelector.removeChild(channelSelector.firstChild);
        }
        for (const channel of channels) {
            const selectOption = new Option;
            selectOption.value = channel.id;
            selectOption.innerText = channel.name;
            channelSelector.appendChild(selectOption);
        }
        messagesWrapperInit();
    });
}
function messagesWrapperInit() {
    return __awaiter(this, void 0, void 0, function* () {
        replyBox.value = '';
        replyBoxCheck();
        if (!messagesWrapper)
            return;
        const data = yield getChannelMessages(guildSelector.value, channelSelector.value);
        data.messages.sort((a, b) => a.timestamps - b.timestamps);
        if (lastmessage === data.messages[data.messages.length - 1].id)
            return;
        lastmessage = data.messages[data.messages.length - 1].id;
        while (messagesWrapper.firstChild) {
            messagesWrapper.removeChild(messagesWrapper.firstChild);
        }
        for (const message of data.messages) {
            const messageBox = new Message(message);
            messagesWrapper.appendChild(messageBox.node);
        }
        messagesWrapper.scrollTop = messagesWrapper.scrollHeight;
    });
}
function send() {
    return __awaiter(this, void 0, void 0, function* () {
        if (messageInput.value === '')
            return;
        const content = messageInput.value;
        messageInput.value = '';
        const status = yield post(originUrl + '/console', {
            guild: guildSelector.value,
            channel: channelSelector.value,
            content: content,
            reply: reply ? replyBox.value : undefined
        });
        if (statusText) {
            statusText.innerText = status;
            setTimeout(() => {
                statusText.innerText = '';
            }, 2000);
        }
    });
}
function post(host, data) {
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
class Message {
    constructor(data) {
        this.node = document.createElement('message-box');
        this.author = document.createElement('author');
        this.content = document.createElement('content');
        this.sticker = document.createElement('sticker');
        this.attachments = document.createElement('attachments');
        this.data = data;
        this.init();
    }
    init() {
        this.author.innerText = this.data.author.name;
        this.content.innerText = this.data.content;
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
                replyBox.value = this.data.url;
                replyBoxCheck();
            });
            this.node.addEventListener('mouseleave', (ev) => {
                replyButton.remove();
            });
        });
    }
}
module.exports = {};
//# sourceMappingURL=console.js.map