"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autocomplete = void 0;
const discord_js_1 = require("discord.js");
function default_1(interact, amateras) {
    return __awaiter(this, void 0, void 0, function* () {
        //await interact.origin.deferReply({ephemeral: false})
        for (const subcmd0 of interact.origin.options.data) {
            if (subcmd0.name === 'register') {
                if (interact._channel.id !== '972403680844333086' && interact._channel.id !== '804531119394783276')
                    return interact.origin.reply({ content: '请在指定的频道中使用指令', ephemeral: true });
                if (!subcmd0.options)
                    return;
                for (const subcmd1 of subcmd0.options) {
                    if (subcmd1.name === 'image') {
                        if (subcmd1.type !== discord_js_1.ApplicationCommandOptionType.Attachment)
                            return;
                        if (!subcmd1.attachment)
                            return;
                        if (subcmd1.attachment.contentType !== 'image/png' && subcmd1.attachment.contentType !== 'image/jpeg')
                            return interact.origin.reply({ content: '上传内容必须是 JPG / PNG 格式', ephemeral: true });
                        const reg = yield amateras.events.ise.registerStudent(interact._user.origin);
                        if (reg !== 'Success')
                            return interact.origin.reply({ content: reg, ephemeral: true });
                        yield interact.origin.deferReply();
                        const buffer = yield amateras.download.buffer(subcmd1.attachment.url);
                        yield interact.origin.followUp({
                            files: [
                                {
                                    attachment: buffer,
                                    name: subcmd1.attachment.name ? subcmd1.attachment.name : undefined,
                                    description: 'ISE Academy Character Card'
                                }
                            ],
                            ephemeral: false
                        });
                        const fetch = yield interact.origin.fetchReply();
                        const attachment = fetch.attachments.first();
                        if (!attachment) {
                            amateras.error('Ise Student Register Error: Attachment not found');
                            return fetch.delete().catch();
                        }
                        const regImage = yield amateras.events.ise.registerStudentImage(interact._user.origin, attachment.url);
                        if (regImage !== 'Success') {
                            amateras.error('Ise Student Register Error: Attachment not found');
                            return fetch.delete().catch();
                        }
                    }
                }
            }
            else if (subcmd0.name === 'card') {
                const data = yield amateras.events.ise.getStudent(interact._user.id);
                if (!data)
                    return interact.origin.reply({ content: '尚未登记', ephemeral: true });
                interact.origin.reply({ embeds: [yield amateras.events.ise.characterCardEmbed(data)] });
            }
            else if (subcmd0.name === 'npc') {
                // only specify role access
                if (!interact.member.roles.cache.has('972403941952352276') && interact._user.id !== '318714557105307648')
                    return;
                if (!subcmd0.options)
                    return;
                for (const subcmd1 of subcmd0.options) {
                    if (subcmd1.name === 'add') {
                        const data = {
                            name: '',
                            avatar: ''
                        };
                        if (!subcmd1.options)
                            return;
                        for (const subcmd2 of subcmd1.options) {
                            if (subcmd2.name === 'name') {
                                data.name = subcmd2.value;
                            }
                            else if (subcmd2.name === 'avatar') {
                                if (!subcmd2.attachment)
                                    return;
                                if (subcmd2.attachment.contentType !== 'image/png' && subcmd2.attachment.contentType !== 'image/jpeg')
                                    return interact.origin.reply({ content: '上传内容必须是 JPG / PNG 格式', ephemeral: true });
                                yield interact.origin.deferReply({ ephemeral: true });
                                data.avatar = yield amateras.server.saveFile(subcmd2.attachment.url, 'public/image/npc-avatar');
                            }
                        }
                        yield amateras.events.ise.npc.add({ active: true, name: data.name, avatar: data.avatar });
                        interact.origin.followUp({ content: 'NPC 已创建', ephemeral: true });
                    }
                    else if (subcmd1.name === 'leave') {
                        const data = { id: '' };
                        if (!subcmd1.options)
                            return;
                        for (const subcmd2 of subcmd1.options) {
                            if (subcmd2.name === 'id') {
                                data.id = subcmd2.value;
                            }
                        }
                        const npc = amateras.events.ise.npc.cache.get(data.id);
                        if (!npc)
                            return interact.origin.reply({ content: 'NPC 不存在', ephemeral: true });
                        const result = yield npc.delete();
                        interact.origin.reply({ content: result, ephemeral: true });
                    }
                    else if (subcmd1.name === 'card') {
                        const data = { id: '' };
                        if (!subcmd1.options)
                            return;
                        for (const subcmd2 of subcmd1.options) {
                            if (subcmd2.name === 'id') {
                                data.id = subcmd2.value;
                            }
                        }
                        yield interact.origin.deferReply();
                        const npc = amateras.events.ise.npc.cache.get(data.id);
                        if (!npc)
                            return interact.origin.followUp({ content: 'NPC 不存在', ephemeral: true });
                        interact.origin.followUp({ embeds: [yield npc.embed()] });
                    }
                }
            }
        }
    });
}
exports.default = default_1;
function autocomplete(interact, amateras) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const subcmd0 of interact.origin.options.data) {
            if (subcmd0.name === 'npc') {
                if (!subcmd0.options)
                    return;
                for (const subcmd1 of subcmd0.options) {
                    if (subcmd1.name === 'leave' || subcmd1.name === 'card') {
                        if (!subcmd1.options)
                            return;
                        for (const subcmd2 of subcmd1.options) {
                            if (subcmd2.name === 'id') {
                                const choices = Array.from(amateras.events.ise.npc.cache.values());
                                // filter characters
                                const filtered = choices.filter(choice => choice.name.startsWith(subcmd2.value) || choice.id.startsWith(subcmd2.value));
                                interact.origin.respond(filtered.map(choice => ({ name: `${choice.name} (${choice.id})`, value: choice.id })));
                            }
                        }
                    }
                }
            }
        }
    });
}
exports.autocomplete = autocomplete;
//# sourceMappingURL=ise.js.map