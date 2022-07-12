import { Amateras } from "./Amateras.js";
import { IseNpc, IseNpcDB, IseNpcOptions } from "./IseNpc.js";
import { _BaseManagerDB } from "./_BaseManagerDB.js";

export class IseNpcManager extends _BaseManagerDB<IseNpc, IseNpcDB> {
    constructor(amateras: Amateras) {
        super(amateras, amateras.db.collection('ise-npc'))
    }

    async init() {
        console.log('| ISE-NPC Initializing...')
        console.time('| ISE-NPC Initialized')
        const npcList = await this.collection.find({active: true}).toArray()
        for (const npc of npcList) {
            if (!npc.webhooks) npc.webhooks = []
            const obj = new IseNpc(this.amateras, npc)
            this.cache.set(obj.id, obj)
            await obj.init()
        }
        console.timeEnd(`| ISE-NPC Initialized`)
    }

    async add(options: IseNpcOptions) {
        const data = {
            ...options,
            id: `${this.amateras.system.snowflake.getUniqueID()}`,
            webhooks: []
        }
        const npc = new IseNpc(this.amateras, data)
        this.cache.set(npc.id, npc)
        await npc.init()
        await npc.save()
    }
}