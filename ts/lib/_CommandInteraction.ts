import { CommandInteraction } from "discord.js"
import { Amateras } from "./Amateras"
import { _Guild } from "./_Guild"
import { _Interaction } from "./_Interaction"
import { _TextChannel } from "./_TextChannel"
import { _ThreadChannel } from "./_ThreadChannel"
import { _User } from "./_User"

export class _CommandInteraction extends _Interaction {
    origin: CommandInteraction
    constructor(amateras: Amateras, interaction: CommandInteraction, _user: _User) {
        super(amateras, interaction, _user)
        this.origin = interaction
    }
}

export interface _ValidCommandInteraction extends _CommandInteraction {
    _guild: _Guild;
    _channel: _TextChannel | _ThreadChannel;
    valid: true
}