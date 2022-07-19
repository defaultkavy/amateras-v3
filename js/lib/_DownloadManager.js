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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._DownloadManager = void 0;
const https_1 = __importDefault(require("https"));
const _Base_js_1 = require("./_Base.js");
class _DownloadManager extends _Base_js_1._Base {
    constructor(amateras) {
        super(amateras);
    }
    buffer(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const data = [];
                https_1.default.get(url, res => {
                    res
                        .on('data', (chunk) => {
                        data.push(chunk);
                    })
                        .on('error', err => {
                        reject(err);
                    })
                        .on('end', () => {
                        resolve(Buffer.concat(data));
                    });
                });
            });
        });
    }
}
exports._DownloadManager = _DownloadManager;
//# sourceMappingURL=_DownloadManager.js.map