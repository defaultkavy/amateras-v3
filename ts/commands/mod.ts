import { Amateras } from "../lib/Amateras";
import { _ValidCommandInteraction } from "../lib/_CommandInteraction";
import { _ValidInteraction } from "../lib/_Interaction";

export default async function mod(interact: _ValidCommandInteraction, amateras: Amateras) {
    await interact.origin.deferReply({ephemeral: true})
    for (const subcmd0 of interact.origin.options.data) {
        if (subcmd0.name === 'notify') {
            if (!subcmd0.options) return
            for (const subcmd1 of subcmd0.options) {
                if (!subcmd1.options) return
                if (subcmd1.name === 'set') {
                    const obj: {
                        id: string,
                        channelId: string,
                        roleId?: string,
                        message?: string
                    } = {
                        id: '',
                        channelId: ''
                    }
                    for (const subcmd2 of subcmd1.options) {
                        if (subcmd2.name === 'id') obj.id = subcmd2.value as string
                        else if (subcmd2.name === 'channel') obj.channelId = subcmd2.value as string
                        else if (subcmd2.name === 'role') obj.roleId = subcmd2.value as string
                        else if (subcmd2.name === 'message') obj.message = subcmd2.value as string
                    }
        
                    await interact._guild.notifiers.add(obj)
                    interact._guild.notifiers.save()
                    interact.origin.followUp({content: 'Notifier set.', ephemeral: true})

                } else if (subcmd1.name === 'ui') {
                    const obj: {
                        id: string
                    } = {id: ''}
                    if (!subcmd1.options) return
                    for (const subcmd2 of subcmd1.options) {
                        if (subcmd2.name === 'id') obj.id = subcmd2.value as string
                    }

                    const _notifier = interact._guild.notifiers.cache.get(obj.id)
                    if (!_notifier) return interact.origin.followUp({content: 'The notifier is not setup.', ephemeral: true})
                    const embed = await _notifier.embed()
                    if (!embed) return interact.origin.followUp({content: 'Error.', ephemeral: true})
                    amateras.messages.send(interact._channel.origin, {embeds: [embed], components: [_notifier.components]}, 'NOTIFIER_PANEL', {notifierId: _notifier.id})
                    interact.origin.followUp({content: 'Sent.', ephemeral: true})
                }
            }
        }
    }
}