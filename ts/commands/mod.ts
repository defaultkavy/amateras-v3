import { ApplicationCommandChoicesOption, ApplicationCommandOptionChoiceData, ModalOptions } from "discord.js";
import { Amateras } from "../lib/Amateras";
import { _ValidAutoCompleteInteraction } from "../lib/_AutoCompleteInteraction";
import { _ValidCommandInteraction } from "../lib/_CommandInteraction";
import { _ValidInteraction } from "../lib/_Interaction";

export default async function mod(interact: _ValidCommandInteraction, amateras: Amateras) {
    for (const subcmd0 of interact.origin.options.data) {
        if (subcmd0.name === 'notify') {
            await interact.origin.deferReply({ephemeral: true})
            if (!subcmd0.options) return
            for (const subcmd1 of subcmd0.options) {
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
                    if (!subcmd1.options) return
                    for (const subcmd2 of subcmd1.options) {
                        if (subcmd2.name === 'id') obj.id = subcmd2.value as string
                        else if (subcmd2.name === 'channel') obj.channelId = subcmd2.value as string
                        else if (subcmd2.name === 'role') obj.roleId = subcmd2.value as string
                        else if (subcmd2.name === 'message') obj.message = subcmd2.value as string
                    }
                    const channel = await amateras.system.youtube.fetchChannel(obj.channelId)
                    if (!channel) return interact.origin.followUp({content: 'Channel not exist.', ephemeral: true})
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
        } else if (subcmd0.name === 'hint') {
            if (!subcmd0.options) return
            for (const subcmd1 of subcmd0.options) {
                if (subcmd1.name === 'on') {
                    if (!interact._channel.isText()) return interact.origin.reply({content: 'Must be Text Channel', ephemeral: true})
                    const modal: ModalOptions = {
                        title: "Channel hint form",
                        customId: "hintModal",
                        components: [
                            {
                                type: 'ACTION_ROW',
                                components: [
                                    {
                                        type: 'TEXT_INPUT',
                                        customId: "title",
                                        label: "Title",
                                        style: 'SHORT',
                                        minLength: 1,
                                        maxLength: 4000,
                                        placeholder: "Title"
                                    }
                                ]
                            },
                            {
                                type: 'ACTION_ROW',
                                components: [
                                    {
                                        type: 'TEXT_INPUT',
                                        customId: "description",
                                        label: "Description",
                                        style: 'PARAGRAPH',
                                        minLength: 1,
                                        maxLength: 4000,
                                        placeholder: "Description"
                                    }
                                ]
                            }
                        ]
                      }
                    await interact.origin.showModal(modal)
                } else if (subcmd1.name === 'off') {
                    if (!interact._channel.isText()) return interact.origin.reply({content: 'Must be Text Channel', ephemeral: true})
                    
                    interact.origin.reply({content: await interact._channel.disableHint(), ephemeral: true})
                }
            }
        } else if (subcmd0.name === 'cmd') {
            if (!subcmd0.options) return
            for (const subcmd1 of subcmd0.options) {
                if (subcmd1.name === 'limit') {
                    if (!subcmd1.options) return
                    
                    const obj = {name: '', channelId: ''}
                    for (const subcmd2 of subcmd1.options) {
                        if (subcmd2.name === 'cmd') obj.name = subcmd2.value as string
                        else if (subcmd2.name === 'channel') obj.channelId = subcmd2.value as string
                    }

                    const arr = Array.from(interact._guild.commands.cache.values())
                    const _guildCommand = arr.find(_guildCommand => _guildCommand.name === obj.name)
                    if (!_guildCommand) return interact.origin.reply({content: "Command not found", ephemeral: true})
                    if (obj.channelId === '') {
                        let _channels = 'Limited Channel:\n'
                        for (const channelId of _guildCommand.limitedChannels) {
                            const _channel = interact._guild.channels.cache.get(channelId)
                            if (_channel) _channels += `${_channel.origin}\n`
                        }
                        interact.origin.reply({content: _channels, ephemeral: true})
                    } else {
                        if (_guildCommand.limitedChannels.includes(obj.channelId)) {
                            _guildCommand.removeChannel(obj.channelId)
                            interact.origin.reply({content: 'Limit channel remove', ephemeral: true})
                        } else {
                            _guildCommand.addChannel(obj.channelId)
                            interact.origin.reply({content: 'Limit channel set', ephemeral: true})
                        }
                    }
                }
            }
        }
    }
}

export async function autocomplete(interact: _ValidAutoCompleteInteraction, amateras: Amateras) {

    for (const subcmd0 of interact.origin.options.data) {
        if (subcmd0.name === 'cmd') {
            if (!subcmd0.options) return
            for (const subcmd1 of subcmd0.options) {
                if (subcmd1.name === 'limit') {
                    if (!subcmd1.options) return
                    for (const subcmd2 of subcmd1.options) {
                        if (subcmd2.name === 'cmd') {
                            const choices = Array.from(interact._guild.commands.cache.values())
                            // filter characters
                            const filtered = choices.filter(choice => choice.name.startsWith(subcmd2.value as string))
                            interact.origin.respond(filtered.map(choice => ({name: choice.name, value: choice.name})))
                        }
                    }
                }
            }
        }
    }
}