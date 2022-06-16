import { Interaction } from "discord.js";
import { Amateras } from "../lib/Amateras";
import fs from 'fs'
import { _CommandInteraction } from "../lib/_CommandInteraction";
import { _ValidInteraction } from "../lib/_Interaction";
import { _ButtonInteraction } from "../lib/_ButtonInteraction";

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interact: Interaction, amateras: Amateras) {
        
        const _user = await amateras.users.fetch(interact.user.id)
        if (!_user) return
        
        // Command interaction
        if (interact.isCommand()) {
            const _validInteract = new _CommandInteraction(amateras, interact, _user)
            if (!_validInteract.isValid()) return
            executeCommand(`commands/${interact.commandName}`, _validInteract)
        }

        // Button interaction
        if (interact.isButton()) {
            const _validInteract = new _ButtonInteraction(amateras, interact, _user)
            if (!_validInteract.isValid()) return
            executeCommand(`reacts/${interact.customId}`, _validInteract)
        }
        
        function executeCommand(path: string, _interact: _ValidInteraction) {
            // Check command file exist
            if (fs.existsSync(`./js/${path}.js`)) {
                const commandFn = require(`../${path}.js`);
                commandFn.default(_interact, amateras);
            } else {
                throw new Error('Command not exist. Function file not found.')
            }
        }
    }
}