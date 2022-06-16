import { Amateras } from "../lib/Amateras";
import { _ValidButtonInteraction } from "../lib/_ButtonInteraction";
import { _ValidInteraction } from "../lib/_Interaction";

export default async function subscribeButton(interact: _ValidButtonInteraction, amateras: Amateras) {
    const _message = await amateras.messages.fetch(interact.origin.message.id)
    if (!_message) return interact.origin.reply({content: 'Error', ephemeral: true})
    if (!_message.isNotifierPanel()) return
    const _guildNotifier = interact._guild.notifiers.cache.get(_message.data.notifierId)
    if (!_guildNotifier) return
    const role = _guildNotifier.role
    if (!role) return interact.origin.reply({content: '未设置身分组。', ephemeral: true})
    const member = interact._guild.origin.members.cache.get(interact._user.id)
    if (!member) return
    await member.roles.add(role)
    interact.origin.reply({content: '已打开通知。', ephemeral: true})
}