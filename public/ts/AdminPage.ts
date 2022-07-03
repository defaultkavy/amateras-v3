import { Client } from "./Client.js";
import { Page } from "./Page.js";
import { _MessageWrapper } from "./_MessageWrapper.js";
import { _ReplyInput } from "./_ReplyInput.js";
import { _Selector } from "./_Selector.js";


export class AdminPage extends Page {
    messages: _MessageWrapper;
    reply: _ReplyInput;
    guildSelector: _Selector;
    categorySelector: _Selector;
    channelSelector: _Selector;
    input: HTMLTextAreaElement;
    sendButton: HTMLButtonElement;
    statusText: HTMLSpanElement;
    clearButton: HTMLSpanElement;
    constructor(client: Client, id: string) {
        super(client, id)
        this.messages = new _MessageWrapper(client, this, document.createElement('message-wrapper'))
        this.reply = new _ReplyInput(client, this, document.createElement('input'))
        this.guildSelector = new _Selector(client, this, document.createElement('select'), 'guild_selector')
        this.categorySelector = new _Selector(client, this, document.createElement('select'), 'category_selector')
        this.channelSelector = new _Selector(client, this, document.createElement('select'), 'channel_selector')
        this.input = document.createElement('textarea')
        this.clearButton = this.client.createTitle('Clear')
        this.sendButton = document.createElement('button')
        this.sendButton.innerText = 'Send'
        this.statusText = document.createElement('span')
        this.statusText.id = 'status'
    }

    async init() {
        this.layout()
        this.eventHandler()
        this.load()

        const data = await this.discordData()
        for (const guild of data.guilds) {
            this.guildSelector.addOption(guild.name, guild.id)
        }
        await this.categoryInit(data)
        this.client.server.connect('/stream')
        this.client.server.onmessage((data) => {
            if (data.type === 'update') {
                this.messages.init()
            }
        })
    }

    async eventHandler() {
        this.guildSelector.node.addEventListener('change', async () => this.categoryInit(await this.discordData()))
        this.categorySelector.node.addEventListener('change', async () => this.channelInit(await this.discordData()))
        this.channelSelector.node.addEventListener('change', async () => this.messages.init())
        this.clearButton.addEventListener('click', (ev) => { this.reply.clear() })
        this.sendButton.addEventListener('click', (ev) => { this.send() })
        
        let virtualKeyboard = false
        this.input.addEventListener('focus', (ev) => {
            window.addEventListener('resize', resize)
        })

        this.input.addEventListener('blur', (ev) => {
            window.removeEventListener('resize', resize)
            virtualKeyboard = false
        })

        function resize() {
            virtualKeyboard = true
        }

        this.input.addEventListener('keyup', (ev) => {

            if (!virtualKeyboard && ev.key === 'Enter') {
                if (!ev.shiftKey) this.send()
            }
        })
    }

    async categoryInit(data: DiscordData) {
        const guild = data.guilds.find(guild => guild.id === this.guildId)
        if (!guild) return
        // clean options
        this.categorySelector.clearOptions()
        // sort categories
        guild.categories.sort((a, b) => a.position - b.position)
        //
        if (guild.channels.find(channel => !channel.parent)) this.categorySelector.addOption('Uncategory', 'none')
        for (const category of guild.categories) {
            this.categorySelector.addOption(category.name, category.id)
        }

        await this.channelInit(data)
    }

    async channelInit(data: DiscordData) {
        const guild = data.guilds.find(guild => guild.id === this.guildId)
        if (!guild) return
        // filter category
        const channels = guild.channels.filter(channel => {
            if (this.categorySelector.node.selectedOptions[0].value === 'none') {
                return !channel.parent
            } else {
                return channel.parent === this.categoryId
            }
        })
        // sort channels
        channels.sort((a, b) => {
            if (a.position === undefined) return -1
            if (b.position === undefined) return 1
            return a.position - b.position
        })
        // clean options
        this.channelSelector.clearOptions()
        for (const channel of channels) {
            this.channelSelector.addOption(channel.name, channel.id)
        }

        this.messages.init()
    }

    async send() {
        // cache content before clear
        const content = this.input.value
        this.input.value = ''
        //
        const status = await this.client.server.post(this.client.origin + '/console', {
            guild: this.guildSelector.node.value,
            channel: this.channelSelector.node.value,
            content: content,
            reply: this.reply.trigger ? this.reply.node.value : undefined
        })

        this.statusText.innerText = status as string
        setTimeout(() => {
            this.statusText.innerText = ''
        }, 2000);
    }

    private layout() {
        const selectorSection = this.client.createDiv('selector_section')
        this.node.appendChild(selectorSection)
        // first
        const firstBlock = this.client.createDiv('selector_block')
        selectorSection.appendChild(firstBlock)
        firstBlock.appendChild(this.client.createTitle('Server'))
        firstBlock.appendChild(this.guildSelector.node)
        // first
        const secondBlock = this.client.createDiv('selector_block')
        selectorSection.appendChild(secondBlock)
        secondBlock.appendChild(this.client.createTitle('Category'))
        secondBlock.appendChild(this.categorySelector.node)
        // first
        const thirdBlock = this.client.createDiv('selector_block')
        selectorSection.appendChild(thirdBlock)
        thirdBlock.appendChild(this.client.createTitle('Channel'))
        thirdBlock.appendChild(this.channelSelector.node)
        // 
        this.node.appendChild(this.messages.node)
        //
        const reply_section = this.client.createDiv('reply_section')
        this.node.appendChild(reply_section)
        reply_section.appendChild(this.clearButton)
        reply_section.appendChild(this.reply.node)
        // input
        const input_section = this.client.createDiv('input_section')
        this.node.appendChild(input_section)
        input_section.appendChild(this.input)
        input_section.appendChild(this.sendButton)
        input_section.appendChild(this.statusText)
    }

    async discordData() {
        return await (await fetch(this.client.origin + '/console-data')).json() as DiscordData
    }

    get channelId() {
        return this.channelSelector.node.selectedOptions[0].value
    }

    get guildId() {
        return this.guildSelector.node.selectedOptions[0].value
    }

    get categoryId() {
        return this.categorySelector.node.selectedOptions[0].value
    }
}

export interface DiscordData {
    guilds: DiscordGuild[]
}

export interface DiscordGuild {
    id: string,
    name: string,
    channels: DiscordChannel[],
    categories: {
        id: string,
        name: string,
        position: number
    }[]
}

export interface DiscordChannel {
    id: string,
    name: string,
    parent: string | null
    position: number | undefined
}