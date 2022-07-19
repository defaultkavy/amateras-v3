import { AutocompleteInteraction } from "discord.js"
import { Amateras } from "./Amateras"
import { _Guild } from "./_Guild"
import { _Interaction } from "./_Interaction"
import { _TextBaseChannel } from "./_TextBaseChannel"
import { _TextChannel } from "./_TextChannel"
import { _ThreadChannel } from "./_ThreadChannel"
import { _User } from "./_User"

export class _AutoCompleteInteraction extends _Interaction {
    origin: AutocompleteInteraction<'cached'>
    constructor(amateras: Amateras, interaction: AutocompleteInteraction<'cached'>, _user: _User) {
        super(amateras, interaction, _user)
        this.origin = interaction
    }
}

export interface _ValidAutoCompleteInteraction extends _AutoCompleteInteraction {
    _guild: _Guild;
    _channel: _TextBaseChannel;
    valid: true
}