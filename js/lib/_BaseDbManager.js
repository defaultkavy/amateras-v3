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
exports._BaseDbManager = void 0;
const _Base_1 = require("./_Base");
class _BaseDbManager extends _Base_1._Base {
    constructor(amateras, collection) {
        super(amateras);
        this.collection = collection;
        this.cache = new Map;
    }
    index() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection.countDocuments();
        });
    }
}
exports._BaseDbManager = _BaseDbManager;
//# sourceMappingURL=_BaseDbManager.js.map