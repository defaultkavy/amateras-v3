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
const fs_1 = __importDefault(require("fs"));
const _CommandInteraction_1 = require("../lib/_CommandInteraction");
const _ButtonInteraction_1 = require("../lib/_ButtonInteraction");
module.exports = {
    name: 'interactionCreate',
    once: false,
    execute(interact, amateras) {
        return __awaiter(this, void 0, void 0, function* () {
            const _user = yield amateras.users.fetch(interact.user.id);
            if (!_user)
                return;
            // Command interaction
            if (interact.isCommand()) {
                const _validInteract = new _CommandInteraction_1._CommandInteraction(amateras, interact, _user);
                if (!_validInteract.isValid())
                    return;
                executeCommand(`commands/${interact.commandName}`, _validInteract);
            }
            // Button interaction
            if (interact.isButton()) {
                const _validInteract = new _ButtonInteraction_1._ButtonInteraction(amateras, interact, _user);
                if (!_validInteract.isValid())
                    return;
                executeCommand(`reacts/${interact.customId}`, _validInteract);
            }
            function executeCommand(path, _interact) {
                // Check command file exist
                if (fs_1.default.existsSync(`./js/${path}.js`)) {
                    const commandFn = require(`../${path}.js`);
                    commandFn.default(_interact, amateras);
                }
                else {
                    throw new Error('Command not exist. Function file not found.');
                }
            }
        });
    }
};
//# sourceMappingURL=interactionCreate.js.map