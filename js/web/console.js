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
const originUrl = window.location.protocol + '//' + window.location.host + '/v3';
const sendButton = document.getElementById('send_button');
const messageBox = document.getElementById('message_box');
const guildSelector = document.getElementById('guild_selector');
const categorySelector = document.getElementById('category_selector');
const channelSelector = document.getElementById('channel_selector');
const statusText = document.getElementById('status');
init();
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        eventHandler();
        yield contentInit();
    });
}
function eventHandler() {
    if (sendButton && messageBox) {
        sendButton.addEventListener('click', send);
    }
    if (guildSelector) {
        guildSelector.addEventListener('change', categoryBoxInit);
    }
    if (categorySelector) {
        categorySelector.addEventListener('change', channelBoxInit);
    }
    if (messageBox) {
        let virtualKeyboard = false;
        messageBox.addEventListener('focus', (ev) => {
            window.addEventListener('resize', resize);
        });
        messageBox.addEventListener('blur', (ev) => {
            window.removeEventListener('resize', resize);
            virtualKeyboard = false;
        });
        function resize() {
            virtualKeyboard = true;
        }
        messageBox.addEventListener('keyup', (ev) => {
            if (!virtualKeyboard && ev.key === 'Enter') {
                if (!ev.shiftKey)
                    send();
            }
        });
    }
}
function getDiscordData() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (yield fetch(originUrl + '/console-data')).json();
    });
}
function contentInit() {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield getDiscordData();
        console.debug(data);
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
    });
}
function send() {
    return __awaiter(this, void 0, void 0, function* () {
        if (messageBox.value === '')
            return;
        const content = messageBox.value;
        messageBox.value = '';
        const status = yield post(originUrl + '/console', {
            guild: guildSelector.value,
            channel: channelSelector.value,
            content: content
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
//# sourceMappingURL=console.js.map