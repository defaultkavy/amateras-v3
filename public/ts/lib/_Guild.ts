import { Base } from "./Base.js"
import { Client } from "./Client.js"

export class _Guild extends Base {
    id: string
    name: string
    channels: ConsoleChannelData[]
    categories: ConsoleCategoryData[]
    emojis: ConsoleEmojiData[]
    access: boolean
    members: ConsoleMemberData[]
    roles: ConsoleRoleData[]
    threads: ConsoleThreadData[]
    constructor(client: Client, data: ConsoleGuildData) {
        super(client)
        this.id = data.id
        this.name = data.name
        this.channels = data.channels
        this.categories = data.categories
        this.threads = data.threads
        this.emojis = data.emojis
        this.access = data.access
        this.members = data.members
        this.roles = data.roles
    }
}

export interface ConsoleGuildData {
    id: string,
    name: string,
    categories: ConsoleCategoryData[],
    channels: ConsoleChannelData[],
    threads: ConsoleThreadData[],
    access: boolean,
    emojis: ConsoleEmojiData[],
    members: ConsoleMemberData[],
    roles: ConsoleRoleData[]
}

export interface ConsoleCategoryData {
    id: string,
    name: string,
    position: number
}

export interface ConsoleChannelData {
    id: string,
    name: string,
    position: number | undefined,
    parent: string | null,
    access: boolean
}

export interface ConsoleThreadData {
    id: string,
    name: string,
    parent: string | null,
    joined: boolean
}

export interface ConsoleEmojiData {
    id: string,
    name: string | null,
    url: string
}

export interface ConsoleMemberData {
    id: string,
    name: string
}

export interface ConsoleRoleData {
    id: string,
    name: string
}