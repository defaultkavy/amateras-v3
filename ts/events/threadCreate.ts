import { Channel, GuildChannel } from "discord.js";
import request from "request-promise";
import { Amateras } from "../lib/Amateras";

module.exports = {
    name: 'threadCreate',
    once: false,
    async execute(channel: GuildChannel, amateras: Amateras) {
        const _guild = amateras.guilds.cache.get(channel.guild.id)
        if (!_guild) return
        _guild.channels.refresh()
        request('http://localhost:5500/console-update').catch(() => {})
    }

}