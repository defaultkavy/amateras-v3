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
exports.IseNpcManager = void 0;
const IseNpc_js_1 = require("./IseNpc.js");
const _BaseManagerDB_js_1 = require("./_BaseManagerDB.js");
class IseNpcManager extends _BaseManagerDB_js_1._BaseManagerDB {
    constructor(amateras) {
        super(amateras, amateras.db.collection('ise-npc'));
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('| ISE-NPC Initializing...');
            console.time('| ISE-NPC Initialized');
            const npcList = yield this.collection.find({ active: true }).toArray();
            for (const npc of npcList) {
                if (!npc.webhooks)
                    npc.webhooks = [];
                const obj = new IseNpc_js_1.IseNpc(this.amateras, npc);
                this.cache.set(obj.id, obj);
                yield obj.init();
            }
            console.timeEnd(`| ISE-NPC Initialized`);
        });
    }
    add(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = Object.assign(Object.assign({}, options), { id: `${this.amateras.system.snowflake.getUniqueID()}`, webhooks: [] });
            const npc = new IseNpc_js_1.IseNpc(this.amateras, data);
            this.cache.set(npc.id, npc);
            yield npc.init();
            yield npc.save();
        });
    }
}
exports.IseNpcManager = IseNpcManager;
//# sourceMappingURL=IseNpcManager.js.map