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
exports.EventManager = void 0;
const IseGakuen_1 = require("./IseGakuen");
const _Base_1 = require("./_Base");
class EventManager extends _Base_1._Base {
    constructor(amateras) {
        super(amateras);
        this.ise = new IseGakuen_1.IseGakuen(amateras);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ise.init();
        });
    }
}
exports.EventManager = EventManager;
//# sourceMappingURL=_EventManager.js.map