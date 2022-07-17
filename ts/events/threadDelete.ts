import { ThreadChannel } from "discord.js";
import request from "request-promise";
import { Amateras } from "../lib/Amateras";

module.exports = {
    name: 'threadDelete',
    once: false,
    async execute(thread: ThreadChannel, amateras: Amateras) {
        request('http://localhost:5500/console-update').catch(() => {})
    }

}