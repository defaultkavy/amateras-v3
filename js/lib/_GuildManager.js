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
exports._GuildManager = void 0;
const _BaseManagerDB_1 = require("./_BaseManagerDB");
const _Guild_1 = require("./_Guild");
class _GuildManager extends _BaseManagerDB_1._BaseManagerDB {
    constructor(amateras) {
        super(amateras, amateras.db.collection('guilds'));
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const guilds = this.amateras.client.guilds.cache.values();
            for (const guild of guilds) {
                const dbObj = yield this.collection.findOne({ id: guild.id });
                const obj = new _Guild_1._Guild(this.amateras, guild, yield this.buildData(dbObj, guild));
                yield obj.init();
                this.cache.set(obj.id, obj);
                obj.save();
            }
        });
    }
    buildData(dbObj, guild) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                id: guild.id,
                name: guild.name,
                notifiers: dbObj ? dbObj.notifiers ? dbObj.notifiers : [] : [],
                hints: dbObj ? dbObj.hints ? dbObj.hints : [] : [],
                commands: dbObj ? dbObj.commands ? dbObj.commands : [] : [],
            };
        });
    }
}
exports._GuildManager = _GuildManager;
//# sourceMappingURL=_GuildManager.js.map