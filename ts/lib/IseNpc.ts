import { EmbedFieldData, MessageEmbedOptions, MessageOptions, TextChannel, Webhook } from "discord.js";
import requestPromise from "request-promise";
import { Amateras } from "./Amateras.js";
import { ISE_TEACHER_DATA } from "./IseGakuen.js";
import { _Base } from "./_Base.js";
import { _BaseObj } from "./_BaseObj.js";
import { _Guild } from "./_Guild.js";
import { _TextChannel } from "./_TextChannel.js";
import { _ThreadChannel } from "./_ThreadChannel.js";

export class IseNpc extends _BaseObj {
    id: string;
    name: string;
    avatar: string;
    active: boolean;
    webhooks: Map<string, Webhook>
    #webhooks: IseNpcWebhookDB[]
    constructor(amateras: Amateras, options: IseNpcDB) {
        super(amateras, options, amateras.db.collection('ise-npc'), ['webhooks'])
        this.id = options.id
        this.name = options.name
        this.avatar = options.avatar
        this.active = options.active
        this.webhooks = new Map
        this.#webhooks = options.webhooks
    }

    async init() {
        for (const data of this.#webhooks) {
            const _guild = this.amateras.guilds.cache.get(data.guildId)
            if (!_guild) continue
            const _channel = _guild.channels.cache.get(data.channelId)
            if (!_channel || !_channel.isText()) return
            const webhook = _channel.webhooks.cache.get(data.webhookId)
            if (!webhook) return
            this.webhooks.set(_channel.id, webhook)
        }
    }

    async createWebhook(_channel: _TextChannel) {
        const webhook = await _channel.webhooks.create(this.name, this.avatar, 'ISE NPC')
        this.webhooks.set(_channel.id, webhook)
        await this.save()
        return webhook
    }

    async send(_channel: _TextChannel | _ThreadChannel, options: MessageOptions) {
        if (_channel instanceof _ThreadChannel) {
            const _guild = this.amateras.guilds.cache.get(_channel._guild.id)
            if (!_guild) return
            if (!_channel.origin.parentId) return
            const parentChannel = _guild.channels.cache.get(_channel.origin.parentId)
            if (!(parentChannel instanceof _TextChannel)) return
            const webhook = this.webhooks.has(parentChannel.id) ? this.webhooks.get(parentChannel.id) : await this.createWebhook(parentChannel)
            if (!webhook) return this.amateras.system.log('Webhook is undefined')
            await requestPromise(`https://discord.com/api/webhooks/${webhook.id}/${webhook.token}?thread_id=${_channel.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(options)
            }).catch(err => this.amateras.system.log(err))
            return
        } else {
            const webhook = this.webhooks.has(_channel.id) ? this.webhooks.get(_channel.id) : await this.createWebhook(_channel)
            if (!webhook) return this.amateras.system.log('Webhook is undefined')
            return await webhook.send(options)
        }
    }
    
    async presave() {
        const webhooks = []
        for (const webhook of this.webhooks) {
            webhooks.push({
                guildId: webhook[1].guildId,
                channelId: webhook[0],
                webhookId: webhook[1].id
            })
        }
        return {
            webhooks: webhooks
        }
    }

    async delete() {
        for (const webhook of this.webhooks.values()) {
            webhook.delete().catch(err => this.amateras.system.log(err))
        }
        this.active = false
        this.save()
        this.amateras.events.ise.npc.cache.delete(this.id)
        return 'NPC Leave'
    }

    async embed() {
        const data = await this.getInfo()
        if (!data) {
            const embed: MessageEmbedOptions = {
                author: {
                    name: `${this.name}`
                },
                thumbnail: {
                    url: this.avatar
                },
                image: {
                    url: 'https://cdn.discordapp.com/attachments/804531119394783276/989579863910408202/white.png'
                }
            }
            this.amateras.system.log('IseNpc - data undefined')
            return embed
        }
        const embed: MessageEmbedOptions = {
            author: {
                name: `${this.name}`
            },
            thumbnail: {
                url: this.avatar
            },
            description: data.description,
            fields: this.fields(data),
            image: {
                url: 'https://cdn.discordapp.com/attachments/804531119394783276/989579863910408202/white.png'
            }
        }
        return embed
    }

    async getInfo() {
        return await this.amateras.events.ise.getNpc(this.id)
    }

    private fields(data: ISE_TEACHER_DATA) {
        const skip = ['id', 'name', 'description']
        const fields: EmbedFieldData[] = []
        for (const header in data) {
            if (!data[header]) continue
            if (skip.includes(header)) continue
            fields.push({
                name: headerFields[header as fieldProperty],
                value: data[header],
                inline: header === 'characteristic' ? false : true
            })
        }
        return fields
    }
}

type fieldProperty = 'age' | 'height' | 'gender' | 'country' | 'characteristic'

enum headerFields {
    'age' = '年龄',
    'height' = '身高',
    'gender' = '性别',
    'country' = '国籍',
    'characteristic' = '性格',
    'role' = '身份',
    'race' = '种族'
}

export interface IseNpcOptions {
    name: string;
    avatar: string;
    active: boolean
}

export interface IseNpcDB extends IseNpcOptions {
    id: string;
    webhooks: IseNpcWebhookDB[]
}

export interface IseNpcWebhookDB {
    guildId: string,
    channelId: string,
    webhookId: string
}