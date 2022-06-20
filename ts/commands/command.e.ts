import { Amateras } from "../lib/Amateras";
import { _ValidCommandInteraction } from "../lib/_CommandInteraction";

export default async function (interact: _ValidCommandInteraction, amateras: Amateras) {
    await interact.origin.deferReply({ephemeral: true})
    for (const subcmd0 of interact.origin.options.data) {
        if (subcmd0.name === '') {
            if (!subcmd0.options) return
            for (const subcmd1 of subcmd0.options) {
                if (!subcmd1.options) return
                if (subcmd1.name === '') {
                    const obj: {
                        id: string
                    } = {
                        id: ''
                    }
                    for (const subcmd2 of subcmd1.options) {
                        if (subcmd2.name === 'id') obj.id = subcmd2.value as string
                    }

                    interact.origin.followUp({content: '', ephemeral: true})

                }
            }
        }
    }
}