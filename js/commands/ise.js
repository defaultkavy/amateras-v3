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
function default_1(interact, amateras) {
    return __awaiter(this, void 0, void 0, function* () {
        console.debug(2);
        //await interact.origin.deferReply({ephemeral: false})
        for (const subcmd0 of interact.origin.options.data) {
            console.debug(subcmd0);
            if (subcmd0.name === 'register') {
                if (interact._channel.id !== '972403680844333086' && interact._channel.id !== '804531119394783276')
                    return interact.origin.reply({ content: '请在指定的频道中使用指令', ephemeral: true });
                if (!subcmd0.options)
                    return console.debug('ise', 1);
                for (const subcmd1 of subcmd0.options) {
                    if (subcmd1.name === 'image') {
                        if (subcmd1.type !== 'ATTACHMENT')
                            return console.debug('ise', 2);
                        if (!subcmd1.attachment)
                            return console.debug('ise', 3);
                        if (subcmd1.attachment.contentType !== 'image/png' && subcmd1.attachment.contentType !== 'image/jpeg')
                            return interact.origin.reply({ content: '上传内容必须是 JPG / PNG 格式', ephemeral: true });
                        const reg = yield amateras.events.ise.register(interact._user.origin, subcmd1.attachment.url);
                        if (reg !== 'Success')
                            return interact.origin.reply({ content: reg, ephemeral: true });
                        interact.origin.reply({ content: subcmd1.attachment.url, ephemeral: false });
                    }
                }
            }
            else if (subcmd0.name === 'card') {
                const data = yield amateras.events.ise.getStudent(interact._user.id);
                if (!data)
                    return;
                interact.origin.reply({ embeds: [yield amateras.events.ise.characterCardEmbed(data)] });
            }
        }
    });
}
exports.default = default_1;
//# sourceMappingURL=ise.js.map