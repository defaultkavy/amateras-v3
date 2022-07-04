import { DiscordMessageOptions } from "./@types/console.js"
import { AdminPage } from "./AdminPage.js"
import { BasePageElement } from "./BasePageElement.js"
import { Client } from "./Client.js"
import { _MessageEmbed } from "./_MessageEmbed.js"

export class _MessageBox extends BasePageElement {
    author: HTMLElement
    page: AdminPage
    data: DiscordMessageOptions
    content: HTMLElement
    sticker: HTMLElement
    attachments: HTMLElement
    avatar: HTMLImageElement
    embeds: Map<number, _MessageEmbed>
    constructor(client: Client, page: AdminPage, node: HTMLElement, data: DiscordMessageOptions) {
        super(client, page, node)
        this.page = page
        this.data = data
        this.embeds = new Map
        this.author = document.createElement('author')
        this.content = document.createElement('message-content')
        this.sticker = document.createElement('sticker')
        this.attachments = document.createElement('attachments')
        this.avatar = document.createElement('img')
        this.init()
    }

    init() {
        this.author.innerText = this.data.author.name
        this.content.innerText = this.data.content
        this.avatar.src = this.data.author.avatar

        const avatarWrapper = document.createElement('avatar')
        avatarWrapper.appendChild(this.avatar)

        const contentWrapper = document.createElement('content-wrapper')
        this.node.appendChild(avatarWrapper)
        this.node.appendChild(contentWrapper)
        contentWrapper.appendChild(this.author)
        if (this.data.sticker) {
            this.sticker.innerText = this.data.sticker
            contentWrapper.appendChild(this.sticker)
        } else {
            contentWrapper.appendChild(this.content)
        }
        for (const attachment of this.data.attachments) {
            const attachmentBox = document.createElement('attachment')
            attachmentBox.innerText = attachment.type ? attachment.type : 'Unknown File'
            attachmentBox.addEventListener('click', (ev) => {
                window.open(attachment.url, '_Blank')
            })
            this.attachments.appendChild(attachmentBox)
        }

        for (const embed of this.data.embeds) {
            const embedBox = new _MessageEmbed(this.client, this, embed, document.createElement('object-embed'))
            this.embeds.set(+new Date, embedBox)
            contentWrapper.appendChild(embedBox.node)
        }
        contentWrapper.appendChild(this.attachments)

        this.replaceLink()
        this.eventHandler()
    }

    eventHandler() {
        this.node.addEventListener('mouseenter', (ev) => {
            const replyButton = document.createElement('reply-button')
            replyButton.innerText = 'Reply'
            this.node.appendChild(replyButton)

            replyButton.addEventListener('click', (ev) => {
                this.page.reply.node.value = this.data.url
                this.page.reply.check()
            })

            this.node.addEventListener('mouseleave', (ev) => {
                replyButton.remove()
            })
        })
    }

    replaceLink() {
        const regex = /https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}/
        const matches = this.data.content.match(regex)

        if (matches) {
            for (const url of matches) {
                this.content.innerHTML = this.data.content.replace(url, `<a target="_Blank" href="${url}">${url}</a>`)
            }
        }
    }
}