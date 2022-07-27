import { Message } from "discord.js";
import request from "request-promise";
import { Amateras } from "../lib/Amateras";

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(message: Message, amateras: Amateras) {
        const _message = amateras.messages.build(message)
        if (!_message) return
        if (_message._channel.hint) {
            if (_message._channel.hint.sending) return
            if (_message._channel.hint._message && _message.id === _message._channel.hint._message.id) return
            _message._channel.hint.send()
        }
        request('http://localhost:5500/console-update').catch(() => {})
    }

}