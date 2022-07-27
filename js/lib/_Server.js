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
exports._Server = void 0;
const _Base_js_1 = require("./_Base.js");
const express_1 = __importDefault(require("express"));
const cmd_js_1 = __importDefault(require("../plugins/cmd.js"));
const request_promise_1 = __importDefault(require("request-promise"));
class _Server extends _Base_js_1._Base {
    constructor(amateras) {
        super(amateras);
        this.express = (0, express_1.default)();
        this.sessions = new Map;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(cmd_js_1.default.Green, `Initializing Server`);
            console.time('| Server Handler Set');
            this.express.use(express_1.default.json());
            this.express.use(express_1.default.urlencoded({ extended: true }));
            yield this.serverHandler();
            console.timeEnd('| Server Handler Set');
        });
    }
    saveFile(url, path) {
        return __awaiter(this, void 0, void 0, function* () {
            return `https://isekai.live/v3/file/` + (yield request_promise_1.default.post(`${this.amateras.config.server.host}/v3/download`, {
                body: {
                    url: url,
                    path: path
                },
                json: true
            }));
        });
    }
    serverHandler() {
        return new Promise(resolve => {
            this.express.get('/file/*', (req, res) => {
                if (process.platform === 'win32') {
                    res.send(global.path + req.originalUrl.slice(6).replace('/', '\\'));
                }
                else
                    res.send(global.path + req.originalUrl.slice(6));
            });
            this.express.post('/download', (req, res) => __awaiter(this, void 0, void 0, function* () {
                const data = req.body;
                res.send((yield this.amateras.download.file(data.url, data.path)).path);
            }));
            this.express.post('/session', (req, res) => __awaiter(this, void 0, void 0, function* () {
                const data = req.body;
                const get = this.sessions.get(data.sessionID);
                if (!get)
                    res.send(false);
                else
                    res.send(true);
            }));
            // Console
            this.amateras.system.console.login(this.express);
            this.amateras.system.console.get(this.express);
            this.amateras.system.console.post(this.express);
            this.amateras.system.console.getMessages(this.express);
            this.express.listen(30, () => {
                console.log('| Port 30 listening.');
                resolve();
            });
        });
    }
}
exports._Server = _Server;
//# sourceMappingURL=_Server.js.map