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
const discord_js_1 = require("discord.js");
function default_1(interact, amateras) {
    return __awaiter(this, void 0, void 0, function* () {
        yield interact.origin.deferReply({ ephemeral: false });
        const obj = {
            use: ''
        };
        for (const subcmd0 of interact.origin.options.data) {
            if (subcmd0.name === 'action')
                obj.use = subcmd0.value;
        }
        const user_A = interact._user;
        let result = false;
        if (Math.random() > 0.3)
            result = true;
        const embed = {
            title: result ? '成功' : '失败',
            color: result ? discord_js_1.Colors.Green : discord_js_1.Colors.Grey,
            description: `${user_A.origin}${obj.use}`
        };
        interact.origin.followUp({ embeds: [embed] });
    });
}
exports.default = default_1;
//# sourceMappingURL=use.js.map