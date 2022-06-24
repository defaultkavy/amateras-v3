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
        const title = interact.origin.components[0].components[0];
        const description = interact.origin.components[1].components[0];
        const hint = yield interact._channel.enableHint({
            id: interact._channel.id,
            title: title.value,
            description: description.value
        });
        hint.send();
        interact.origin.reply({ content: 'Hint enabled.', ephemeral: true });
    });
}
exports.default = default_1;
//# sourceMappingURL=hintModal.js.map