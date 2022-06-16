"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._User = void 0;
const _BaseObj_1 = require("./_BaseObj");
class _User extends _BaseObj_1._BaseObj {
    constructor(amateras, user, info) {
        super(amateras, info, amateras.users.collection, []);
        this.origin = user;
        this.name = user.username;
    }
}
exports._User = _User;
//# sourceMappingURL=_User.js.map