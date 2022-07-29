import { Guild } from "discord.js";
import { Amateras } from "../lib/Amateras";

module.exports = {
    name: 'guildCreate',
    once: false,
    async execute(guild: Guild, amateras: Amateras) {
        amateras.guilds.add(guild)
    }

}