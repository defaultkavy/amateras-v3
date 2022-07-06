import { DiscordMessageOptions } from "../@types/console.js"
import { AdminPage } from "./AdminPage.js"
import { BasePageElement } from "./BasePageElement.js"
import { Client } from "./Client.js"
import { MessageChannel } from "./MessageChannel.js"
import { _Guild } from "./_Guild.js"
import { _MessageEmbed } from "./_MessageEmbed.js"

export class MessageBox extends BasePageElement {
    author: HTMLElement
    page: AdminPage
    data: DiscordMessageOptions
    content: HTMLElement
    sticker: HTMLElement
    attachments: HTMLElement
    avatar: HTMLImageElement
    embeds: _MessageEmbed[]
    guild: _Guild
    channel: MessageChannel
    constructor(client: Client, page: AdminPage, node: HTMLElement, guild: _Guild, messageChannel: MessageChannel, data: DiscordMessageOptions) {
        super(client, page, node)
        this.page = page
        this.data = data
        this.guild = guild
        this.channel = messageChannel
        this.embeds = []
        this.author = document.createElement('author')
        this.content = document.createElement('message-content')
        this.sticker = document.createElement('sticker')
        this.attachments = document.createElement('attachments')
        this.avatar = document.createElement('img')
    }

    init() {
        this.author.innerText = this.data.author.name
        this.avatar.src = this.data.author.avatar

        if (this.data.sticker)
            this.sticker.innerText = this.data.sticker

        for (const attachment of this.data.attachments) {
            const attachmentBox = document.createElement('attachment')
            if (checkImage(attachment.type)) {
                const img = document.createElement('img')
                img.src = attachment.url
                attachmentBox.classList.add('image')
                attachmentBox.appendChild(img)
            } else {
                attachmentBox.classList.add('unknown')
                attachmentBox.innerText = attachment.type ? attachment.type : 'Unknown File'
            }
            attachmentBox.addEventListener('click', (ev) => {
                window.open(attachment.url, '_Blank')
            })
            this.attachments.appendChild(attachmentBox)
        }

        let text = this.data.content
        // replace
        text = text.replace(/\n/g, '<br>')
        text = this.replaceLink(text)
        text = this.replaceEmoji(text)
        text = this.replaceChannel(text)
        text = this.replaceMember(text)
        text = this.replaceRole(text)
        this.content.innerHTML = text

        for (const embed of this.data.embeds) {
            const embedBox = new _MessageEmbed(this.client, this, embed, document.createElement('object-embed'))
            this.embeds.push(embedBox)
        }
        console.debug(this.embeds)

        this.emojiInit()
        this.eventHandler()
        this.layout()
        function checkImage(type: string | null) {
            if (type === 'image/jpeg' || type === 'image/png') return true
            return false
        }
    }

    layout() {

        const avatarWrapper = document.createElement('avatar')
        avatarWrapper.appendChild(this.avatar)

        const contentWrapper = document.createElement('content-wrapper')

        const lastMessage = Array.from(this.channel.cache.values()).pop()
        if (lastMessage) {
            if (this.data.author.id !== lastMessage.data.author.id) {
                addUpper.call(this)
            } else {
                 if (this.data.timestamps - lastMessage.data.timestamps > 1000 * 60 * 10) {
                    addUpper.call(this)
                 } else {
                    const span = document.createElement('span')
                    span.classList.add('timestamp')
                    this.node.appendChild(span)
                 }
            }
        } else addUpper.call(this)

        function addUpper(this: MessageBox) {
            const upperWrapper = document.createElement('upper-wrapper')
            upperWrapper.appendChild(this.author)
            this.node.appendChild(avatarWrapper)
            contentWrapper.appendChild(upperWrapper)
            this.node.classList.add('first')
        }

        if (this.data.sticker) {
            contentWrapper.appendChild(this.sticker)
        } else {
            contentWrapper.appendChild(this.content)
        }

        for (const embedBox of this.embeds.values()) {
            contentWrapper.append(embedBox.node)
        }

        contentWrapper.appendChild(this.attachments)
        
        this.node.appendChild(contentWrapper)
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

    emojiInit() {
        const emojiElements = this.content.querySelectorAll('emoji') as NodeListOf<HTMLElement>
        for (const emojiElement of emojiElements) {
            const img = document.createElement('img')
            img.src = `https://cdn.discordapp.com/emojis/${emojiElement.dataset.id}.png`
            if (!this.content.textContent) emojiElement.classList.add('big_emoji')
            else if (!this.content.textContent.match(/[^ ]/g)) emojiElement.classList.add('big_emoji')
            
            emojiElement.appendChild(img)
        }
    }

    replaceLink(text: string) {

        if (this.links) {
            for (const url of this.links) {
                text = text.replace(url, `<a target="_Blank" href="${url}">${url}</a>`)
            }
        }

        return text
    }

    replaceEmoji(text: string) {
        const regex = /<:[\d\w]+:[0-9]+>/g
        const matches = this.data.content.match(regex)
        if (matches) {
            for (const match of matches) {
                const id = match.match(/\d+(?=>)/)
                if (!id) continue
                text = text.replace(match, `<emoji data-id="${id}"></emoji>`)
            }
        }
        return text
    }

    replaceChannel(text: string) {
        const channelTags = text.match(/(<#)[0-9]\d+(>)/g)
        if (channelTags) {
            for (const channelTag of channelTags) {
                const channel = this.guild.channels.find(channel => channel.id === channelTag.slice(2, channelTag.length - 1))
                if (!channel) continue
                text = text.replace(channelTag, `<channel>＃${channel.name}</channel>`)
            }
        }
        return text
    }

    replaceMember(text: string) {
        const memberMentions = text.match(/(<@)[0-9]\d+(>)/g)
        if (memberMentions) {
            for (const memberMention of memberMentions) {
                const member = this.guild.members.find(member => member.id === memberMention.slice(2, memberMention.length - 1))
                if (!member) continue
                text = text.replace(memberMention, `<member>@${member.name}</member>`)
            }
        }
        return text
    }

    replaceRole(text: string) {
        const roleMentions = text.match(/(<@&)[0-9]\d+(>)/g)
        if (roleMentions) {
            for (const roleMention of roleMentions) {
                const role = this.guild.roles.find(role => role.id === roleMention.slice(3, roleMention.length - 1))
                if (!role) continue
                text = text.replace(roleMention, `<role>@${role.name}</role>`)
            }
        }
        return text
    }

    get links() {
        const regex = /https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}/g
        return this.data.content.match(regex)
    }
}