"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._CommandInteraction = void 0;
const _Interaction_1 = require("./_Interaction");
class _CommandInteraction extends _Interaction_1._Interaction {
    constructor(amateras, interaction, _user) {
        super(amateras, interaction, _user);
        this.origin = interaction;
    }
}
exports._CommandInteraction = _CommandInteraction;
//# sourceMappingURL=_CommandInteraction.js.map