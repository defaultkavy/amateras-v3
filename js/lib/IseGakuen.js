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
class IseGakuen extends _Base_1._Base {
    constructor(amateras) {
        super(amateras);
        this.grade = ['', '高一', '高二', '高三'];
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const spreadsheets = new google_spreadsheet_1.GoogleSpreadsheet('1zg2rL9zbiCYPdsVgnKrNzhGeK2nlKlM_EH-kw2QGWMk');
            yield spreadsheets.useServiceAccountAuth(this.amateras.system.cert);
            yield spreadsheets.loadInfo();
            const sheets = spreadsheets.sheetsByTitle;
            this.sheet = sheets['Bot Data'];
        });
    }
    getStudent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.sheet)
                return;
            const rows = yield this.sheet.getRows();
            const headers = this.sheet.headerValues;
            const arr = [];
            for (let i = 1; i < rows.length; i++) {
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
    register(user, image) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.sheet)
                return 'Database not found';
            const rows = yield this.sheet.getRows();
            const row = rows.find((row) => row.tag === user.tag);
            if (!row)
                return 'No Record';
            row.id = user.id;
            row.characterCard = image;
            yield row.save();
            return 'Success';
        });
    }
    characterCardEmbed(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const embed = {
                author: {
                    name: data.name
                },
                thumbnail: {
                    url: data.characterCard
                },
                fields: [
                    {
                        name: '年龄',
                        value: `${data.age}`,
                        inline: true
                    },
                    {
                        name: '年级',
                        value: `${this.grade[+data.grade]}`,
                        inline: true
                    },
                    {
                        name: '种族',
                        value: `${data.race}`,
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