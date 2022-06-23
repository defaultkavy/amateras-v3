import { Amateras } from "./Amateras";
import { IseGakuen } from "./IseGakuen";
import { _Base } from "./_Base";

export class EventManager extends _Base {
    ise: IseGakuen;
    constructor(amateras: Amateras) {
        super(amateras)
        this.ise = new IseGakuen(amateras)
    }

    async init() {
        await this.ise.init()
    }
}