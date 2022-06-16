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
function subscribeButton(interact, amateras) {
    return __awaiter(this, void 0, void 0, function* () {
        const _message = yield amateras.messages.fetch(interact.origin.message.id);
        if (!_message)
            return interact.origin.reply({ content: 'Error', ephemeral: true });
        if (!_message.isNotifierPanel())
            return;
        const _guildNotifier = interact._guild.notifiers.cache.get(_message.data.notifierId);
        if (!_guildNotifier)
            return;
        const role = _guildNotifier.role;
        if (!role)
            return interact.origin.reply({ content: '未设置身分组。', ephemeral: true });
        const member = interact._guild.origin.members.cache.get(interact._user.id);
        if (!member)
            return;
        yield member.roles.add(role);
        interact.origin.reply({ content: '已打开通知。', ephemeral: true });
    });
}
exports.default = subscribeButton;
//# sourceMappingURL=subscribeButton%20copy.js.map