import { Guild } from "discord.js";
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
            const dbObj = await this.collection.findOne({id: guild.id})
            const obj = new _Guild(this.amateras, guild, await this.buildData(dbObj, guild))
            await obj.init()
            this.cache.set(obj.id, obj)
            obj.save()
        }

    }

    async buildData(dbObj: _GuildDB | null, guild: Guild): Promise<_GuildInfo> {
        return {
            id: guild.id,
            name: guild.name,
            index: dbObj ? typeof dbObj.index === 'number' ? dbObj.index : await this.index() : await this.index(),
            notifiers: dbObj ? dbObj.notifiers ? dbObj.notifiers : [] : []
        }
    }
}