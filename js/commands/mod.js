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
function mod(interact, amateras) {
    return __awaiter(this, void 0, void 0, function* () {
        yield interact.origin.deferReply({ ephemeral: true });
        for (const subcmd0 of interact.origin.options.data) {
            if (subcmd0.name === 'notify') {
                if (!subcmd0.options)
                    return;
                for (const subcmd1 of subcmd0.options) {
                    if (!subcmd1.options)
                        return;
                    if (subcmd1.name === 'set') {
                        const obj = {
                            id: '',
                            channelId: ''
                        };
                        for (const subcmd2 of subcmd1.options) {
                            if (subcmd2.name === 'id')
                                obj.id = subcmd2.value;
                            else if (subcmd2.name === 'channel')
                                obj.channelId = subcmd2.value;
                            else if (subcmd2.name === 'role')
                                obj.roleId = subcmd2.value;
                            else if (subcmd2.name === 'message')
                                obj.message = subcmd2.value;
                        }
                        yield interact._guild.notifiers.add(obj);
                        interact._guild.notifiers.save();
                        interact.origin.followUp({ content: 'Notifier set.', ephemeral: true });
                    }
                    else if (subcmd1.name === 'ui') {
                        const obj = { id: '' };
                        if (!subcmd1.options)
                            return;
                        for (const subcmd2 of subcmd1.options) {
                            if (subcmd2.name === 'id')
                                obj.id = subcmd2.value;
                        }
                        const _notifier = interact._guild.notifiers.cache.get(obj.id);
                        if (!_notifier)
                            return interact.origin.followUp({ content: 'The notifier is not setup.', ephemeral: true });
                        const embed = yield _notifier.embed();
                        if (!embed)
                            return interact.origin.followUp({ content: 'Error.', ephemeral: true });
                        amateras.messages.send(interact._channel.origin, { embeds: [embed], components: [_notifier.components] }, 'NOTIFIER_PANEL', { notifierId: _notifier.id });
                        interact.origin.followUp({ content: 'Sent.', ephemeral: true });
                    }
                }
            }
        }
    });
}
exports.default = mod;
//# sourceMappingURL=mod.js.map