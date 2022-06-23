import { Amateras } from "../lib/Amateras";
import { _ValidCommandInteraction } from "../lib/_CommandInteraction";

export default async function (interact: _ValidCommandInteraction, amateras: Amateras) {
    //await interact.origin.deferReply({ephemeral: false})
    for (const subcmd0 of interact.origin.options.data) {
        if (subcmd0.name === 'register') {
            if (!subcmd0.options) return
            for (const subcmd1 of subcmd0.options) {
                if (subcmd1.name === 'image') {
                    if (subcmd1.type !== 'ATTACHMENT') return
                    if (!subcmd1.attachment) return
                    if (subcmd1.attachment.contentType !== 'image/png' && subcmd1.attachment.contentType !== 'image/jpeg') return interact.origin.reply({content: '上传内容必须是 JPG / PNG 格式', ephemeral: true})

                    const reg = await amateras.events.ise.register(interact._user.origin, subcmd1.attachment.url)
                    if (reg === 'No Record' || !reg) return interact.origin.reply({content: reg, ephemeral: true})
                    interact.origin.reply({content: subcmd1.attachment.url, ephemeral: false})
                }
                
            }
        } else if (subcmd0.name === 'card') {
            const data = await amateras.events.ise.getStudent(interact._user.id)
            if (!data) return
            interact.origin.reply({embeds: [await amateras.events.ise.characterCardEmbed(data)]})
        }
    }
}