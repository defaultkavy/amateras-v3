import { TextInputModalData } from "discord.js";
import { Amateras } from "../lib/Amateras";
import { _ValidModalInteraction } from "../lib/_ModalInteraction";

export default async function (interact: _ValidModalInteraction, amateras: Amateras) {
    const title = interact.origin.components[0].components[0] as TextInputModalData
    const description = interact.origin.components[1].components[0] as TextInputModalData
    
    const hint = await interact._channel.enableHint({
        id: interact._channel.id,
        title: title.value,
        description: description.value
    })

    hint.send()
    interact.origin.reply({content: 'Hint enabled.', ephemeral: true})
}