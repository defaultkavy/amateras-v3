import { Guild } from "discord.js";
import cmd from "../plugins/cmd.js";
import { Amateras } from "./Amateras";
import { _BaseManagerDB } from "./_BaseManagerDB";
import { _Guild, _GuildDB, _GuildInfo } from "./_Guild";

export class _GuildManager extends _BaseManagerDB<_Guild, _GuildDB> {
    constructor(amateras: Amateras) {
        super(amateras, amateras.db.collection('guilds'))
    }

    async init() {
        const guilds = this.amateras.client.guilds.cache.values()
        for (const guild of guilds) {
            await this.add(guild)
        }
    }

    async add(guild: Guild) {
        const dbObj = await this.collection.findOne({id: guild.id})
        const obj = new _Guild(this.amateras, guild, await this.buildData(dbObj, guild))
        await obj.init()
        this.cache.set(obj.id, obj)
        obj.save()
    }

    async remove(guild: Guild) {
        this.cache.delete(guild.id)
        console.log(cmd.Green, `Leave Guild: ${guild.name}`)
    }

    async buildData(dbObj: _GuildDB | null, guild: Guild): Promise<_GuildInfo> {
        return {
            id: guild.id,
            name: guild.name,
            notifiers: dbObj ? dbObj.notifiers ? dbObj.notifiers : [] : [],
            hints: dbObj ? dbObj.hints ? dbObj.hints : [] : [],
            commands: dbObj ? dbObj.commands ? dbObj.commands : [] : [],
        }
    }
}