import { APIEmbed, Colors } from "discord.js";
import { Amateras } from "../lib/Amateras";
import { _ValidCommandInteraction } from "../lib/_CommandInteraction";

export default async function (interact: _ValidCommandInteraction, amateras: Amateras) {
    await interact.origin.deferReply({ephemeral: false})

    const obj: {
        use: string
    } = {
        use: ''
    }
    for (const subcmd0 of interact.origin.options.data) {
        if (subcmd0.name === 'action') obj.use = subcmd0.value as string
    }

    const user_A = interact._user

    let result = false
    if (Math.random() > 0.3) result = true

    const embed: APIEmbed = {
        title: result ? '成功' : '失败',
        color: result ? Colors.Green : Colors.Grey,
        description: `${user_A.origin}${obj.use}`
    }
    interact.origin.followUp({embeds: [embed]})
}