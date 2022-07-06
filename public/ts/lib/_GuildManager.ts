import { Base } from "./Base.js"
import { Client } from "./Client.js"
import { ConsoleGuildData, _Guild } from "./_Guild.js"

export class _GuildManager extends Base {
    cache: Map<string, _Guild>
    constructor(client: Client) {
        super(client)
        this.cache = new Map
    }

    init(data: ConsoleGuildData[]) {
        for (const guild of data) {
            this.cache.set(guild.id, new _Guild(this.client, guild))
        }
    }

    get array() {
        return Array.from(this.cache.values())
    }
}