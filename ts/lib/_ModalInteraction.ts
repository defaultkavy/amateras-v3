import { ButtonInteraction, ModalSubmitInteraction } from "discord.js"
import { Amateras } from "./Amateras"
import { _Guild } from "./_Guild"
import { _Interaction } from "./_Interaction"
import { _TextBaseChannel } from "./_TextBaseChannel"
import { _TextChannel } from "./_TextChannel"
import { _User } from "./_User"

export class _ModalInteraction extends _Interaction {
    origin: ModalSubmitInteraction
    constructor(amateras: Amateras, interaction: ModalSubmitInteraction, _user: _User) {
        super(amateras, interaction, _user)
        this.origin = interaction
    }
}

export interface _ValidModalInteraction extends _ModalInteraction {
    _guild: _Guild;
    _channel: _TextBaseChannel;
    valid: true
}