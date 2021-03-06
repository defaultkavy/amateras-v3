"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fs_1 = __importDefault(require("fs"));
const _CommandInteraction_1 = require("../lib/_CommandInteraction");
const _ButtonInteraction_1 = require("../lib/_ButtonInteraction");
const _ModalInteraction_1 = require("../lib/_ModalInteraction");
const _AutoCompleteInteraction_1 = require("../lib/_AutoCompleteInteraction");
module.exports = {
    name: 'interactionCreate',
    once: false,
    execute(interact, amateras) {
        return __awaiter(this, void 0, void 0, function* () {
            const _user = yield amateras.users.fetch(interact.user.id);
            if (!_user)
                return;
            if (!interact.inCachedGuild())
                return;
            // Command interaction
            if (interact.isChatInputCommand()) {
                let cmdName = interact.commandName;
                for (const subcmd0 of interact.options.data) {
                    cmdName += ` ${subcmd0.name}`;
                    if (subcmd0.options)
                        for (const subcmd1 of subcmd0.options) {
                            cmdName += ` ${subcmd1.name}`;
                        }
                }
                amateras.log(`${cmdName} - ${_user.name}`);
                const _validInteract = new _CommandInteraction_1._CommandInteraction(amateras, interact, _user);
                if (!_validInteract.isValid())
                    return console.error('_CommandInteraction is not valid');
                // Check limited channel list
                const _guildCommand = _validInteract._guild.commands.cache.get(interact.commandId);
                if (_guildCommand &&
                    _guildCommand.limitedChannels.length !== 0 &&
                    !_guildCommand.limitedChannels.includes(_validInteract._channel.id))
                    return interact.reply({ content: '???????????????????????????', ephemeral: true });
                //
                executeCommand(`commands/${interact.commandName}`, _validInteract);
            }
            // Button interaction
            if (interact.isButton()) {
                const _validInteract = new _ButtonInteraction_1._ButtonInteraction(amateras, interact, _user);
                if (!_validInteract.isValid())
                    return;
                executeCommand(`reacts/${interact.customId}`, _validInteract);
            }
            // Modal interaction
            if (interact.type === discord_js_1.InteractionType.ModalSubmit) {
                const irt = interact;
                const _validInteract = new _ModalInteraction_1._ModalInteraction(amateras, irt, _user);
                if (!_validInteract.isValid())
                    return;
                executeCommand(`reacts/${irt.customId}`, _validInteract);
            }
            // AutoComplete Interaction
            if (interact.type === discord_js_1.InteractionType.ApplicationCommandAutocomplete) {
                const irt = interact;
                const _validInteract = new _AutoCompleteInteraction_1._AutoCompleteInteraction(amateras, irt, _user);
                if (!_validInteract.isValid())
                    return;
                executeCommand(`commands/${irt.commandName}`, _validInteract, true);
            }
            function executeCommand(path, _interact, autocomplete) {
                // Check command file exist
                if (fs_1.default.existsSync(`./js/${path}.js`)) {
                    const commandFn = require(`../${path}.js`);
                    try {
                        if (!autocomplete)
                            commandFn.default(_interact, amateras);
                        else {
                            commandFn.autocomplete(_interact, amateras);
                        }
                    }
                    catch (err) {
                        console.log(err);
                    }
                }
                else {
                    //throw new Error('Command not exist. Function file not found.')
                }
            }
        });
    }
};
//# sourceMappingURL=interactionCreate.js.map