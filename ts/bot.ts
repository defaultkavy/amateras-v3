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

import discord, { Intents } from 'discord.js'
import { Amateras } from './lib/Amateras'

const client = new discord.Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_VOICE_STATES],
    partials: ['MESSAGE', 'REACTION', 'CHANNEL', 'GUILD_MEMBER']
})

console.log(cmd.Cyan, 'Connecting to Discord...')
console.time('| Discord Connected')
client.login(config.bot.token)
console.timeEnd('| Discord Connected');
client.on('ready', async () => {
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