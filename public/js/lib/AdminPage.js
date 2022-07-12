var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Page } from "./Page.js";
import { _ReplyInput } from "./_ReplyInput.js";
import { _Selector } from "./_Selector.js";
import { MessageChannelManager } from "./MessageChannelManager.js";
export class AdminPage extends Page {
    constructor(client, id) {
        super(client, id);
        this.channels = new MessageChannelManager(client, this, document.createElement('message-channel-manager'));
        this.reply = new _ReplyInput(client, this, document.createElement('input'));
        this.guildSelector = new _Selector(client, this, document.createElement('select'), 'guild_selector');
        this.categorySelector = new _Selector(client, this, document.createElement('select'), 'category_selector');
        this.channelSelector = new _Selector(client, this, document.createElement('select'), 'channel_selector');
        this.threadSelector = new _Selector(client, this, document.createElement('select'), 'thread_selector');
        this.npcSelector = new _Selector(client, this, document.createElement('select'), 'npc_selector');
        this.input = document.createElement('textarea');
        this.clearButton = this.client.createTitle('Clear');
        this.sendButton = document.createElement('button');
        this.sendButton.innerText = '>';
        this.statusText = document.createElement('span');
        this.statusText.id = 'status';
        this.guildId = '';
        this.channelId = '';
        this.categoryId = '';
        this.threadId = '';
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.guildInit();
            this.npcInit();
            this.layout();
            this.eventHandler();
            this.load();
            this.channels.load();
            this.client.server.connect('/stream');
            this.client.server.onmessage((data) => {
                if (data.type === 'update') {
                    if (this.channels.channel) {
                        this.channels.load();
                    }
                    this.client.discordData();
                }
            });
        });
    }
    eventHandler() {
        return __awaiter(this, void 0, void 0, function* () {
            this.guildSelector.node.addEventListener('change', () => __awaiter(this, void 0, void 0, function* () {
                this.guildId = this.guildSelector.node.value;
                this.categoryInit();
            }));
            this.categorySelector.node.addEventListener('change', () => __awaiter(this, void 0, void 0, function* () {
                this.categoryId = this.categorySelector.node.value;
                this.channelInit();
            }));
            this.channelSelector.node.addEventListener('change', () => __awaiter(this, void 0, void 0, function* () {
                this.channelId = this.channelSelector.node.value;
                this.threadInit();
                this.channels.load();
            }));
            this.threadSelector.node.addEventListener('change', () => __awaiter(this, void 0, void 0, function* () {
                if (this.threadSelector.node.value === 'none')
                    this.channelId = this.channelSelector.node.value;
                else
                    this.channelId = this.threadSelector.node.value;
                this.channels.load();
            }));
            this.clearButton.addEventListener('click', (ev) => { this.reply.clear(); });
            this.sendButton.addEventListener('click', (ev) => { this.send(); });
            let virtualKeyboard = false;
            this.input.addEventListener('focus', (ev) => {
                window.addEventListener('resize', resize);
            });
            this.input.addEventListener('blur', (ev) => {
                window.removeEventListener('resize', resize);
                virtualKeyboard = false;
            });
            function resize() {
                virtualKeyboard = true;
            }
            this.input.addEventListener('keydown', (ev) => {
                if (!virtualKeyboard && ev.key === 'Enter') {
                    if (!ev.shiftKey) {
                        ev.preventDefault();
                        this.send();
                    }
                }
            });
            this.input.addEventListener('input', (ev) => {
                this.resizeInput();
            });
        });
    }
    guildInit() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const guild of this.client.guilds.array) {
                if (!guild.access)
                    continue;
                this.guildSelector.addOption(guild.name, guild.id);
            }
            this.guildId = this.guildSelector.node.options[0].value;
            yield this.categoryInit();
        });
    }
    categoryInit() {
        return __awaiter(this, void 0, void 0, function* () {
            const guild = this.client.guilds.array.find(guild => guild.id === this.guildId);
            if (!guild)
                return;
            // clean options
            this.categorySelector.clearOptions();
            // filter accessable
            const categories = guild.categories.filter(category => guild.channels.find(channel => channel.parent === category.id && channel.access));
            // sort categories
            categories.sort((a, b) => a.position - b.position);
            //
            if (guild.channels.find(channel => !channel.parent && channel.access === true))
                this.categorySelector.addOption('Uncategory', 'none');
            for (const category of categories) {
                this.categorySelector.addOption(category.name, category.id);
            }
            this.categoryId = this.categorySelector.node.options[0].value;
            yield this.channelInit();
        });
    }
    channelInit() {
        return __awaiter(this, void 0, void 0, function* () {
            const guild = this.client.guilds.array.find(guild => guild.id === this.guildId);
            if (!guild)
                return;
            // filter category
            const channels = guild.channels.filter(channel => {
                if (this.categorySelector.node.selectedOptions[0].value === 'none') {
                    return !channel.parent;
                }
                else {
                    return channel.parent === this.categoryId;
                }
            });
            // sort channels
            channels.sort((a, b) => {
                if (a.position === undefined)
                    return -1;
                if (b.position === undefined)
                    return 1;
                return a.position - b.position;
            });
            // clean options
            this.channelSelector.clearOptions();
            for (const channel of channels) {
                if (!channel.access)
                    continue;
                this.channelSelector.addOption(channel.name, channel.id);
            }
            this.channelId = this.channelSelector.node.options[0].value;
            this.threadInit();
        });
    }
    threadInit() {
        return __awaiter(this, void 0, void 0, function* () {
            const guild = this.client.guilds.array.find(guild => guild.id === this.guildId);
            if (!guild)
                return;
            // filter category
            const threads = guild.threads.filter(thread => {
                return thread.parent === this.channelId && thread.joined;
            });
            this.threadSelector.clearChild();
            this.threadSelector.addOption('none', 'none');
            for (const thread of threads) {
                this.threadSelector.addOption(thread.name, thread.id);
            }
            this.threadSelector.node.style.display = this.threadSelector.node.options.length ? 'block' : 'none';
            this.channels.load();
        });
    }
    npcInit() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.client.role === 'admin')
                this.npcSelector.addOption('none', 'none');
            for (const npc of this.client.npcs.values()) {
                this.npcSelector.addOption(npc.name, npc.id);
            }
        });
    }
    send() {
        return __awaiter(this, void 0, void 0, function* () {
            // cache content before clear
            const content = this.input.value;
            this.input.value = '';
            this.resizeInput();
            //
            const status = yield this.client.server.post(this.client.origin + '/console', {
                guild: this.guildId,
                channel: this.channelId,
                npc: this.npcSelector.node.value === 'none' ? undefined : this.npcSelector.node.value,
                content: content,
                reply: this.reply.trigger ? this.reply.node.value : undefined
            });
            this.statusText.innerText = status;
            setTimeout(() => {
                this.statusText.innerText = '';
            }, 2000);
        });
    }
    resizeInput() {
        this.input.style.height = '20px';
        this.input.style.height = `${this.input.scrollHeight + 3}px`;
    }
    layout() {
        const selectorSection = this.client.createDiv('selector_section');
        this.node.appendChild(selectorSection);
        if (this.guildSelector.node.options.length > 1) {
            // first
            const firstBlock = this.client.createDiv('selector_block');
            selectorSection.appendChild(firstBlock);
            firstBlock.appendChild(this.client.createTitle('Server'));
            firstBlock.appendChild(this.guildSelector.node);
        }
        if (this.categorySelector.node.options.length > 1) {
            // first
            const secondBlock = this.client.createDiv('selector_block');
            selectorSection.appendChild(secondBlock);
            secondBlock.appendChild(this.client.createTitle('Category'));
            secondBlock.appendChild(this.categorySelector.node);
        }
        if (this.channelSelector.node.options.length > 1) {
            // first
            const thirdBlock = this.client.createDiv('selector_block');
            selectorSection.appendChild(thirdBlock);
            thirdBlock.appendChild(this.client.createTitle('Channel'));
            thirdBlock.appendChild(this.channelSelector.node);
        }
        if (this.npcSelector.node.options.length > 0) {
            const forthBlock = this.client.createDiv('selector_block');
            selectorSection.appendChild(forthBlock);
            forthBlock.appendChild(this.client.createTitle('NPC'));
            forthBlock.appendChild(this.npcSelector.node);
        }
        if (this.threadSelector.node.options.length > 0) {
            const block = this.client.createDiv('selector_block');
            selectorSection.appendChild(block);
            block.appendChild(this.client.createTitle('Thread'));
            block.appendChild(this.threadSelector.node);
        }
        // 
        this.node.appendChild(this.channels.node);
        //
        const reply_section = this.client.createDiv('reply_section');
        this.node.appendChild(reply_section);
        reply_section.appendChild(this.clearButton);
        reply_section.appendChild(this.reply.node);
        // input
        const input_section = this.client.createDiv('input_section');
        this.node.appendChild(input_section);
        input_section.appendChild(this.input);
        input_section.appendChild(this.sendButton);
        input_section.appendChild(this.statusText);
    }
}
//# sourceMappingURL=AdminPage.js.map