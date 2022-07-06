import { APIEmbed } from "../../../node_modules/discord-api-types/v9.js";
import { Base } from "./Base.js";
import { Client } from "./Client.js";
import { MessageBox } from "./MessageBox.js";

export class _MessageEmbed extends Base {
    message: MessageBox;
    data: APIEmbed;
    node: HTMLElement;
    authorAvatar: HTMLImageElement;
    authorName: HTMLAnchorElement;
    title: HTMLAnchorElement;
    description: HTMLElement;
    fields: HTMLElement[];
    thumbnail: HTMLImageElement;
    image: HTMLImageElement;
    footerText: HTMLElement;
    footerImage: HTMLImageElement;
    timestamp: HTMLElement;
    constructor(client: Client, message: MessageBox, embedOptions: APIEmbed, node: HTMLElement) {
        super(client)
        this.node = node
        this.message = message
        this.data = embedOptions
        this.authorName = document.createElement('a')
        this.authorAvatar = document.createElement('img')
        this.title = document.createElement('a')
        this.description = document.createElement('description')
        this.fields = []
        this.thumbnail = document.createElement('img')
        this.image = document.createElement('img')
        this.footerText = document.createElement('footer-text')
        this.footerImage = document.createElement('img')
        this.timestamp = document.createElement('timestamp')
        this.init()
    }

    init() {
        // author
        if (this.data.author) {
            this.authorName.innerText = this.data.author.name
            this.authorName.target = '_Blank'
            if (this.data.author.url) 
                this.authorName.href = this.data.author.url
            if (this.data.author.icon_url)
                this.authorAvatar.src = this.data.author.icon_url
        }

        // titile
        if (this.data.title) {
            this.title.innerText = this.data.title
            this.title.target = '_Blank'
            if (this.data.url) {
                this.title.href = this.data.url
            }
        }

        // description
        if (this.data.description) {
            this.description.innerText = this.data.description
        }

        // fields
        if (this.data.fields) {
            let count = 0
            this.fields.push(document.createElement('fields-wrapper'))
            for (const field of this.data.fields) {
                if (count === 3 || !field.inline) {
                    this.fields.push(document.createElement('fields-wrapper'))
                    count = 0
                }
                const fieldElement = document.createElement('field')
                const name = document.createElement('field-name')
                const value = document.createElement('field-value')
                name.innerText = field.name
                value.innerText = field.value
                fieldElement.appendChild(name)
                fieldElement.appendChild(value)
                this.fields[this.fields.length - 1].appendChild(fieldElement)
                count++
            }
        } 

        // thumbnail
        if (this.data.thumbnail) {
            this.thumbnail.src = this.data.thumbnail.url
        }

        // image
        if (this.data.image) {
            this.image.src = this.data.image.url
        }

        // footer
        if (this.data.footer) {
            this.footerText.innerText = this.data.footer.text
            if (this.data.footer.icon_url) {
                this.footerImage.src = this.data.footer.icon_url
            }
        }

        // timestamp
        if (this.data.timestamp) {
            this.timestamp.innerText = new Date(this.data.timestamp).toLocaleDateString() 
                + ' at '
                + new Date(this.data.timestamp).toLocaleTimeString()
        }


        this.layout()
    }

    layout() {
        if (this.data.thumbnail && !this.data.author && !this.data.color && !this.data.description) {
            if (this.message.links && this.message.links.length === 1) {
                if (this.message.content.textContent === this.message.links[0]) this.message.content.innerHTML = ''
            }
            this.node.appendChild(this.thumbnail)
            this.node.classList.add('image_link')
            return
        }

        const hexColor = this.data.color ? '#' + this.data.color.toString(16) : '#2c2f33'
        const color = document.createElement('embed-color')
        color.style.backgroundColor = hexColor

        this.node.appendChild(color)

        const main = document.createElement('embed-main')
        const upperSection = document.createElement('embed-upper-section')
        const textBlock = document.createElement('embed-text-block')
        const lowerSection = document.createElement('embed-lower-section')
        // author
        if (this.data.author) {
            const authorWrapper = document.createElement('embed-author')
            if (this.data.author.icon_url) {
                const authorAvatarWrapper = document.createElement('author-avatar') 
                authorAvatarWrapper.appendChild(this.authorAvatar)
                authorWrapper.appendChild(authorAvatarWrapper)
            }
            authorWrapper.appendChild(this.authorName)
            textBlock.appendChild(authorWrapper)
        }

        // title
        if (this.data.title) {
            this.title.id = 'embed_title'
            textBlock.appendChild(this.title)
        }

        // description
        if (this.data.description) {
            textBlock.appendChild(this.description)
        }

        // fields
        if (this.data.fields) {
            for (const fields of this.fields) {
                textBlock.appendChild(fields)
            }
        }

        upperSection.appendChild(textBlock)

        // thumbnail
        if (this.data.thumbnail) {
            const thumbnailWrapper = document.createElement('thumbnail')
            thumbnailWrapper.appendChild(this.thumbnail)
            upperSection.appendChild(thumbnailWrapper)
        }

        main.appendChild(upperSection)

        // image
        if (this.data.image) {
            const imageWrapper = document.createElement('embed-image')
            imageWrapper.appendChild(this.image)
            lowerSection.appendChild(imageWrapper)
        }

        // footer
        if (this.data.footer) {
            const footerWrapper = document.createElement('embed-footer')
            if (this.data.footer.icon_url) {
                const imageWrapper = document.createElement('footer-image')
                imageWrapper.appendChild(this.footerImage)
                footerWrapper.appendChild(imageWrapper)
            }

            footerWrapper.appendChild(this.footerText)

            // timestamp
            if (this.data.timestamp) {
                const dot = document.createElement('dot')
                dot.innerText = '•'
                footerWrapper.appendChild(dot)
                footerWrapper.appendChild(this.timestamp)
            }

            lowerSection.appendChild(footerWrapper)
        }

        main.appendChild(lowerSection)
        this.node.appendChild(main)
        this.node.style.backgroundImage = `linear-gradient(90deg, ${hexColor}55 0%, rgba(0,0,0,0) 100%)`
    }
}