import { AutocompleteInteraction, BaseInteraction, InteractionType, ModalSubmitInteraction } from "discord.js";
import { Amateras } from "../lib/Amateras";
import fs from 'fs'
import { _CommandInteraction } from "../lib/_CommandInteraction";
import { _ValidInteraction } from "../lib/_Interaction";
import { _ButtonInteraction } from "../lib/_ButtonInteraction";
import { _ModalInteraction } from "../lib/_ModalInteraction";
import { _AutoCompleteInteraction } from "../lib/_AutoCompleteInteraction";

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interact: BaseInteraction, amateras: Amateras) {
        const _user = await amateras.users.fetch(interact.user.id)
        if (!_user) return
        if (!interact.inCachedGuild()) return
        // Command interaction
        if (interact.isChatInputCommand()) {
            let cmdName = interact.commandName
            for (const subcmd0 of interact.options.data) {
                cmdName += ` ${subcmd0.name}`
                if (subcmd0.options) for (const subcmd1 of subcmd0.options) {
                    cmdName += ` ${subcmd1.name}`
                }
            }
            amateras.log(`${cmdName} - ${_user.name}`)
            
            const _validInteract = new _CommandInteraction(amateras, interact, _user)
            if (!_validInteract.isValid()) return console.error('_CommandInteraction is not valid')
            // Check limited channel list
            const _guildCommand = _validInteract._guild.commands.cache.get(interact.commandId)
            if (_guildCommand && 
                _guildCommand.limitedChannels.length !== 0 && 
                !_guildCommand.limitedChannels.includes(_validInteract._channel.id)) 
                return interact.reply({content: '无法在此频道中使用', ephemeral: true})
            //
            
            executeCommand(`commands/${interact.commandName}`, _validInteract)
        }

        // Button interaction
        if (interact.isButton()) {
            const _validInteract = new _ButtonInteraction(amateras, interact, _user)
            if (!_validInteract.isValid()) return
            executeCommand(`reacts/${interact.customId}`, _validInteract)
        }

        // Modal interaction
        if (interact.type === InteractionType.ModalSubmit) {
            const irt = interact as ModalSubmitInteraction<'cached'>
            const _validInteract = new _ModalInteraction(amateras, irt, _user)
            if (!_validInteract.isValid()) return

            executeCommand(`reacts/${irt.customId}`, _validInteract)
        }

        // AutoComplete Interaction
        if (interact.type === InteractionType.ApplicationCommandAutocomplete) {
            const irt = interact as AutocompleteInteraction<'cached'>
            const _validInteract = new _AutoCompleteInteraction(amateras, irt, _user)
            if (!_validInteract.isValid()) return
                executeCommand(`commands/${irt.commandName}`, _validInteract, true)
        }
        
        function executeCommand(path: string, _interact: _ValidInteraction, autocomplete?: boolean) {
            // Check command file exist
            if (fs.existsSync(`./js/${path}.js`)) {
                const commandFn = require(`../${path}.js`);
                try {
                    if (!autocomplete) commandFn.default(_interact, amateras);
                    else {
                        commandFn.autocomplete(_interact, amateras)
                    }
                } catch(err) {
                    console.log(err)
                }
            } else {
                //throw new Error('Command not exist. Function file not found.')
            }
        }
    }
}