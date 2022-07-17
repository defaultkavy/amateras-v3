import { GuildMember } from "discord.js";
import request from "request-promise";
import { Amateras } from "../lib/Amateras";

module.exports = {
    name: 'threadMemberUpdate',
    once: false,
    async execute(oldMember: GuildMember, newMember: GuildMember, amateras: Amateras) {
        request('http://localhost:5500/console-update').catch(() => {})
    }

}