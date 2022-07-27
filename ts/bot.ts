// nodejs settings
process.env.TZ = 'Asia/Kuala_Lumpur'
global.path = __dirname.slice(0, __dirname.length - 2)
global.port = '30'
//

let config = require('../bot_config.json')
import cmd from './plugins/cmd'

// MongoDB
import { MongoClient } from 'mongodb'

const mongo = new MongoClient(config.db.host, {auth: {username: config.db.user, password: config.db.pwd}})
const db = dbconnect()
async function dbconnect() {
    console.log(cmd.Cyan, 'Connecting to MongoDB...')
    console.time('| MongoDB Connected')
    await mongo.connect()
    console.timeEnd('| MongoDB Connected')
    return mongo.db('amateras-v3')
}

import { Client, GatewayIntentBits, Partials } from 'discord.js'
import { Amateras } from './lib/Amateras'

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.DirectMessages, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.GuildIntegrations, 
        GatewayIntentBits.GuildMessageReactions, 
        GatewayIntentBits.GuildMembers, 
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent
    ],
    partials: [
        Partials.Message, 
        Partials.Reaction,
        Partials.Channel, 
        Partials.GuildMember
    ]
})

console.log(cmd.Cyan, 'Connecting to Discord...')
console.time('| Discord Connected')
client.login(config.bot.token)
client.on('ready', async () => {
    console.timeEnd('| Discord Connected');
    new Amateras({
        client: client,
        db: await db,
        config: config
    })
})

declare global {
    var path: string
    var port: string
}