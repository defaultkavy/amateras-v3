import { User } from "discord.js";
import { Amateras } from "./Amateras";
import { _BaseManagerDB } from "./_BaseManagerDB";
import { _User, _UserDB } from "./_User";

export class _UserManager extends _BaseManagerDB<_User, _UserDB> {
    constructor(amateras: Amateras) {
        super(amateras, amateras.db.collection('users'))
    }

    async fetch(user: string | User) {
        const add = async (user: User) => {
            const dbObj = await this.collection.findOne({id: user.id})
            const obj = new _User(this.amateras, user, await this.buildData(dbObj, user))
            this.cache.set(obj.id, obj)
            obj.save()
            return obj
        }
        // resolve parameter type
        if (typeof user === 'string') {
            // return existed object
            if (this.cache.has(user)) return this.cache.get(user)
            //
            const fetched = await this.amateras.client.users.fetch(user).catch(err => undefined)
            // resolve fetched object
            if (fetched instanceof User) {
                // create and return object
                return add(fetched)
            } else {
                return undefined
            }
            //
        } else if (user instanceof User) {
            // return existed object
            if (this.cache.has(user.id)) return this.cache.get(user.id)
            // create and return object
            return add(user)
        } else {
            return undefined
        }
        //
    }

    async buildData(dbObj: _UserDB | null, user: User): Promise<_UserDB> {
        return {
            id: user.id,
            index: dbObj ? typeof dbObj.index === 'number' ? dbObj.index : await this.index() : await this.index()
        }
    }
}