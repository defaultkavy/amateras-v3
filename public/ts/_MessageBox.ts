import { APIEmbed } from "discord-api-types/v9"
import { Client } from "./Client"

export class _MessageBox {
    node: HTMLElement
    author: HTMLElement
    data: DiscordMessageOptions
    content: HTMLElement
    sticker: HTMLElement
    attachments: HTMLElement
    constructor(client: Client, data: DiscordMessageOptions) {
        this.node = document.createElement('message-box')
        this.author = document.createElement('author')
        this.content = document.createElement('message-content')
        this.sticker = document.createElement('sticker')
        this.attachments = document.createElement('attachments')
        this.data = data
        this.init()
    }

    init() {
        this.author.innerText = this.data.author.name
        this.content.innerText = this.data.content


        this.node.appendChild(this.author)
        if (this.data.sticker) {
            this.sticker.innerText = this.data.sticker
            this.node.appendChild(this.sticker)
        } else {
            this.node.appendChild(this.content)
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
            const embedBox = document.createElement('object-embed')
            embedBox.innerText = 'object/embed'
            this.node.appendChild(embedBox)
        }
        this.node.appendChild(this.attachments)

        this.eventHandler()
    }

    eventHandler() {
        this.node.addEventListener('mouseenter', (ev) => {
            const replyButton = document.createElement('reply-button')
            replyButton.innerText = 'Reply'
            this.node.appendChild(replyButton)

            replyButton.addEventListener('click', (ev) => {
                replyBox.value = this.data.url
                replyBoxCheck()
            })

            this.node.addEventListener('mouseleave', (ev) => {
                replyButton.remove()
            })
        })
    }
}

export interface DiscordMessageOptions {
    id: string,
    content: string,
    author: { name: string, id: string},
    timestamps: number,
    url: string,
    sticker: string | undefined,
    attachments: { type: string | null, url: string }[],
    embeds: APIEmbed[]
}