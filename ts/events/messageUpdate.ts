import { Message } from "discord.js";
import request from "request-promise";
import { Amateras } from "../lib/Amateras";

module.exports = {
    name: 'messageUpdate',
    once: false,
    async execute(message: Message, amateras: Amateras) {
        request('http://localhost:5500/console-update').catch(() => {})
    }

}