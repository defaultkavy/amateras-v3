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
// nodejs settings
process.env.TZ = 'Asia/Kuala_Lumpur';
global.path = __dirname.slice(0, __dirname.length - 2);
global.port = '30';
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
const discord_js_1 = require("discord.js");
const Amateras_1 = require("./lib/Amateras");
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.DirectMessages,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.GuildIntegrations,
        discord_js_1.GatewayIntentBits.GuildMessageReactions,
        discord_js_1.GatewayIntentBits.GuildMembers,
        discord_js_1.GatewayIntentBits.GuildVoiceStates,
        discord_js_1.GatewayIntentBits.GuildMessageReactions,
        discord_js_1.GatewayIntentBits.MessageContent
    ],
    partials: [
        discord_js_1.Partials.Message,
        discord_js_1.Partials.Reaction,
        discord_js_1.Partials.Channel,
        discord_js_1.Partials.GuildMember
    ]
});
console.log(cmd_1.default.Cyan, 'Connecting to Discord...');
console.time('| Discord Connected');
client.login(config.bot.token);
client.on('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    console.timeEnd('| Discord Connected');
    new Amateras_1.Amateras({
        client: client,
        db: yield db,
        config: config
    });
}));
//# sourceMappingURL=bot.js.map