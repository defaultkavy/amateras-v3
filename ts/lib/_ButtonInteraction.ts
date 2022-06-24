import { ButtonInteraction } from "discord.js"
import { Amateras } from "./Amateras"
import { _Guild } from "./_Guild"
import { _Interaction } from "./_Interaction"
import { _TextBaseChannel } from "./_TextBaseChannel"
import { _TextChannel } from "./_TextChannel"
import { _User } from "./_User"

export class _ButtonInteraction extends _Interaction {
    origin: ButtonInteraction
    constructor(amateras: Amateras, interaction: ButtonInteraction, _user: _User) {
        super(amateras, interaction, _user)
        this.origin = interaction
    }
}

export interface _ValidButtonInteraction extends _ButtonInteraction {
    _guild: _Guild;
    _channel: _TextBaseChannel;
    valid: true
}