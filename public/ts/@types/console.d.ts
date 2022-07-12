
export interface DiscordMessageOptions {
    id: string,
    content: string,
    author: { name: string, id: string, avatar: string},
    timestamps: number,
    url: string,
    sticker: string | undefined,
    attachments: { type: string | null, url: string }[],
    embeds: [],
    thread: string | undefined
}

export interface DiscordChannelMessages {
    channel: string,
    guild: string,
    messages: DiscordMessageOptions[]
}