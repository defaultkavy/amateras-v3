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
exports._UserManager = void 0;
const discord_js_1 = require("discord.js");
const _BaseManagerDB_1 = require("./_BaseManagerDB");
const _User_1 = require("./_User");
class _UserManager extends _BaseManagerDB_1._BaseManagerDB {
    constructor(amateras) {
        super(amateras, amateras.db.collection('users'));
    }
    fetch(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const add = (user) => __awaiter(this, void 0, void 0, function* () {
                const dbObj = yield this.collection.findOne({ id: user.id });
                const obj = new _User_1._User(this.amateras, user, yield this.buildData(dbObj, user));
                this.cache.set(obj.id, obj);
                obj.save();
                return obj;
            });
            // resolve parameter type
            if (typeof user === 'string') {
                // return existed object
                if (this.cache.has(user))
                    return this.cache.get(user);
                //
                const fetched = yield this.amateras.client.users.fetch(user).catch(err => undefined);
                // resolve fetched object
                if (fetched instanceof discord_js_1.User) {
                    // create and return object
                    return add(fetched);
                }
                else {
                    return undefined;
                }
                //
            }
            else if (user instanceof discord_js_1.User) {
                // return existed object
                if (this.cache.has(user.id))
                    return this.cache.get(user.id);
                // create and return object
                return add(user);
            }
            else {
                return undefined;
            }
            //
        });
    }
    buildData(dbObj, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                id: user.id,
                index: dbObj ? typeof dbObj.index === 'number' ? dbObj.index : yield this.index() : yield this.index()
            };
        });
    }
}
exports._UserManager = _UserManager;
//# sourceMappingURL=_UserManager.js.map