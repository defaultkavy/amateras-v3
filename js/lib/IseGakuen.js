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
Object.defineProperty(exports, "__esModule", { value: true });
exports.IseGakuen = void 0;
const _Base_1 = require("./_Base");
const google_spreadsheet_1 = require("google-spreadsheet");
const IseNpcManager_js_1 = require("./IseNpcManager.js");
class IseGakuen extends _Base_1._Base {
    constructor(amateras) {
        super(amateras);
        this.grade = ['', '一年级', '二年级', '三年级'];
        this.npc = new IseNpcManager_js_1.IseNpcManager(amateras);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const spreadsheets = new google_spreadsheet_1.GoogleSpreadsheet('14t3Fns8vhturMFmrelIkL5XGiTrfqFlSIMsKBDvFP-Y');
            yield spreadsheets.useServiceAccountAuth(this.amateras.system.cert);
            yield spreadsheets.loadInfo();
            this.sheets = spreadsheets.sheetsByTitle;
            yield this.npc.init();
        });
    }
    getStudent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.sheets)
                return;
            const sheet = this.sheets['Student Data'];
            const rows = yield sheet.getRows();
            const headers = sheet.headerValues;
            const arr = [];
            for (let i = 0; i < rows.length; i++) {
                const obj = {};
                for (const header of headers) {
                    obj[header] = rows[i][header];
                }
                arr.push(obj);
            }
            const playerData = arr.find((value) => value.id === id);
            return playerData;
        });
    }
    getNpc(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.sheets) {
                return this.amateras.error('ISE: Database not found');
            }
            const sheet = this.sheets['NPC Data'];
            if (!sheet) {
                return this.amateras.error('ISE: NPC sheet not found');
            }
            const rows = yield sheet.getRows();
            const row = rows.find(row => row.id === id);
            return row;
        });
    }
    registerStudent(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.sheets) {
                this.amateras.error('ISE: Database not found');
                return 'Database not found';
            }
            const rows = yield this.sheets['Student Data'].getRows();
            const row = rows.find((row) => row.tag === user.tag);
            if (!row) {
                this.amateras.error('ISE: No record in sheet');
                return 'No Record';
            }
            row.id = user.id;
            yield row.save();
            return 'Success';
        });
    }
    registerStudentImage(user, image) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.sheets) {
                this.amateras.error('ISE: Database not found');
                return 'Database not found';
            }
            const sheet = this.sheets['Student Data'];
            if (!sheet) {
                this.amateras.error('ISE: Student sheet not found');
                return 'Student Sheet Not Found';
            }
            const rows = yield this.sheets[''].getRows();
            const row = rows.find((row) => row.id === user.id);
            if (!row) {
                this.amateras.error('ISE: No record in sheet');
                return 'No Record';
            }
            row.characterCard = image;
            yield row.save();
            return 'Success';
        });
    }
    registerTeacher(npc) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.sheets) {
                this.amateras.error('ISE: Database not found');
                return 'Database not found';
            }
            const sheet = this.sheets['NPC Data'];
            if (!sheet) {
                this.amateras.error('ISE: NPC sheet not found');
                return 'NPC Sheet Not Found';
            }
            const rows = yield sheet.getRows();
            if (rows.find(row => row.id === npc.id))
                return;
            yield sheet.addRow({ id: npc.id, name: npc.name });
            return 'Success';
        });
    }
    characterCardEmbed(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const embed = {
                author: {
                    name: `${data.name}`
                },
                thumbnail: {
                    url: data.characterCard
                },
                fields: [
                    {
                        name: `年龄：${data.age}`,
                        value: `年级：${this.grade[+data.grade]}`,
                        inline: true
                    },
                    {
                        name: `班级：${data.class}`,
                        value: `\u200b`,
                        inline: true
                    },
                    {
                        name: `种族：${data.race}`,
                        value: `\u200b`,
                        inline: true
                    }
                ],
                image: {
                    url: 'https://cdn.discordapp.com/attachments/804531119394783276/989579863910408202/white.png'
                }
            };
            return embed;
        });
    }
}
exports.IseGakuen = IseGakuen;
//# sourceMappingURL=IseGakuen.js.map