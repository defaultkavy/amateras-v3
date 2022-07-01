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
        guildSelector.addEventListener('change', channelBoxInit);
    }
    if (messageBox) {
        messageBox.addEventListener('keyup', (ev) => {
            if (ev.key === 'Enter') {
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
        channelBoxInit();
    });
}
function channelBoxInit() {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield getDiscordData();
        const guild = data.guilds.find(guild => guild.id === guildSelector.selectedOptions[0].value);
        if (!guild)
            return;
        while (channelSelector.firstChild) {
            channelSelector.removeChild(channelSelector.firstChild);
        }
        for (const channel of guild.channels) {
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