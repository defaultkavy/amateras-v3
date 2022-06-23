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
        //await interact.origin.deferReply({ephemeral: false})
        for (const subcmd0 of interact.origin.options.data) {
            if (subcmd0.name === 'register') {
                if (!subcmd0.options)
                    return;
                for (const subcmd1 of subcmd0.options) {
                    if (subcmd1.name === 'image') {
                        if (subcmd1.type !== 'ATTACHMENT')
                            return;
                        if (!subcmd1.attachment)
                            return;
                        if (subcmd1.attachment.contentType !== 'image/png' && subcmd1.attachment.contentType !== 'image/jpeg')
                            return interact.origin.reply({ content: '上传内容必须是 JPG / PNG 格式', ephemeral: true });
                        const reg = yield amateras.events.ise.register(interact._user.origin, subcmd1.attachment.url);
                        if (reg === 'No Record' || !reg)
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