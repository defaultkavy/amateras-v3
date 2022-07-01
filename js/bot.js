"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
// nodejs settings
process.env.TZ = 'Asia/Kuala_Lumpur';
global.path = __dirname.slice(0, __dirname.length - 2);
//
let config = require('../bot_config.json');
const cmd_1 = __importDefault(require("./plugins/cmd"));
// MongoDB
const mongodb_1 = require("mongodb");
const mongo = new mongodb_1.MongoClient(config.db.host, { auth: { username: config.db.user, password: config.db.pwd } });
const db = dbconnect();
function dbconnect() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(cmd_1.default.Cyan, 'Connecting to MongoDB...');
        console.time('| MongoDB Connected');
        yield mongo.connect();
        console.timeEnd('| MongoDB Connected');
        return mongo.db('amateras-v3');
    });
}
const discord_js_1 = __importStar(require("discord.js"));
const Amateras_1 = require("./lib/Amateras");
const client = new discord_js_1.default.Client({
    intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.DIRECT_MESSAGES, discord_js_1.Intents.FLAGS.GUILD_MESSAGES, discord_js_1.Intents.FLAGS.GUILD_INTEGRATIONS, discord_js_1.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, discord_js_1.Intents.FLAGS.GUILD_MEMBERS, discord_js_1.Intents.FLAGS.GUILD_VOICE_STATES],
    partials: ['MESSAGE', 'REACTION', 'CHANNEL', 'GUILD_MEMBER']
});
console.log(cmd_1.default.Cyan, 'Connecting to Discord...');
console.time('| Discord Connected');
client.login(config.bot.token);
console.timeEnd('| Discord Connected');
client.on('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    new Amateras_1.Amateras({
        client: client,
        db: yield db,
        config: config
    });
}));
//# sourceMappingURL=bot.js.map