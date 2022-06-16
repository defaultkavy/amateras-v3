import { Amateras } from "./Amateras";
import { _GuildNotifier } from "./_GuildNotifier";
import { _Message, _MessageInfo } from "./_Message";

export class _Notifier_Message extends _Message {
    type = 'NOTIFIER_PANEL'
    data: _Notifier_MessageInfo;
    constructor(amateras: Amateras, info: _MessageInfo, data: _Notifier_MessageInfo) {
        super(amateras, info)
        this.data = data
    }
}

export interface _Notifier_MessageInfo {
    notifierId: string
}