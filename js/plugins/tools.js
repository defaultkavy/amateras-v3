"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayShuffle = exports.reply = exports.timestampDate = exports.msTime = exports.equalOneOf = exports.arrayHasObj = exports.objectEqual = exports.arrayEqual = exports.wordCounter = exports.checkImage = exports.validURL = exports.removeArrayItem = exports.idGenerator = exports.cloneObj = void 0;
const { XMLHttpRequest } = require('xmlhttprequest');
function cloneObj(obj, keys) {
    let result = {};
    for (const i in obj) {
        if (keys && keys.indexOf(i) >= 0)
            continue;
        if (!Object.prototype.hasOwnProperty.call(obj, i))
            continue;
        result[i] = obj[i];
    }
    return result;
}
exports.cloneObj = cloneObj;
function idGenerator(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
exports.idGenerator = idGenerator;
function removeArrayItem(arr, value) {
    if (typeof value === 'number' || typeof value === 'string') {
        const index = arr.indexOf(value);
        if (index > -1) {
            arr.splice(index, 1);
        }
    }
    else if (typeof value === 'object') {
        for (let i = 0; i < arr.length; i++) {
            if (objectEqual(arr[i], value)) {
                arr.splice(i, 1);
            }
        }
    }
    return arr;
}
exports.removeArrayItem = removeArrayItem;
function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}
exports.validURL = validURL;
function checkImage(image_url) {
    if (!image_url || typeof image_url !== 'string')
        return false;
    var http = new XMLHttpRequest;
    http.open('HEAD', image_url, false);
    http.send();
    if (http.status !== 200)
        return false;
    return true;
}
exports.checkImage = checkImage;
function wordCounter(txt, max, lines) {
    let wordsCount = 0;
    let linesCount = 0;
    let result = '';
    for (const char of txt) {
        if (char.match(/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/)) {
            wordsCount += 2;
        }
        else {
            wordsCount += 1;
        }
        if (char.match(/\n/)) {
            linesCount++;
        }
        if (wordsCount > max) {
            return result + "...";
        }
        else if (lines && linesCount > lines) {
            return result;
        }
        else {
            result += char;
        }
    }
    return result;
}
exports.wordCounter = wordCounter;
function arrayEqual(arr, array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;
    // compare lengths - can save a lot of time 
    if (arr.length != array.length)
        return false;
    for (var i = 0, l = arr.length; i < l; i++) {
        // Check if we have nested arrays
        if (arr[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!arr[i].equals(array[i]))
                return false;
        }
        else if (arr[i] instanceof Object && array[i] instanceof Object) {
            if (!objectEqual(arr[i], array[i]))
                return false;
        }
        else if (arr[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}
exports.arrayEqual = arrayEqual;
function objectEqual(obj, object2) {
    //For the first loop, we only check for types
    for (const propName in obj) {
        //Check for inherited methods and properties - like .equals itself
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty
        //Return false if the return value is different
        if (obj.hasOwnProperty(propName) != object2.hasOwnProperty(propName)) {
            return false;
        }
        //Check instance type
        else if (typeof obj[propName] != typeof object2[propName]) {
            //Different types => not equal
            return false;
        }
    }
    //Now a deeper check using other objects property names
    for (const propName in object2) {
        //We must check instances anyway, there may be a property that only exists in object2
        //I wonder, if remembering the checked values from the first loop would be faster or not 
        if (obj.hasOwnProperty(propName) != object2.hasOwnProperty(propName)) {
            return false;
        }
        else if (typeof obj[propName] != typeof object2[propName]) {
            return false;
        }
        //If the property is inherited, do not check any more (it must be equa if both objects inherit it)
        if (!obj.hasOwnProperty(propName))
            continue;
        //Now the detail check and recursion
        //This returns the script back to the array comparing
        /**REQUIRES Array.equals**/
        if (obj[propName] instanceof Array && object2[propName] instanceof Array) {
            // recurse into the nested arrays
            if (!arrayEqual(obj[propName], (object2[propName])))
                return false;
        }
        else if (obj[propName] instanceof Object && object2[propName] instanceof Object) {
            // recurse into another objects
            //console.log("Recursing to compare ", this[propName],"with",object2[propName], " both named \""+propName+"\"");
            if (!arrayEqual(obj[propName], (object2[propName])))
                return false;
        }
        //Normal value comparison for strings and numbers
        else if (obj[propName] != object2[propName]) {
            return false;
        }
    }
    //If everything passed, let's say YES
    return true;
}
exports.objectEqual = objectEqual;
function arrayHasObj(arr, obj) {
    for (const child of arr) {
        if (child instanceof Object) {
            if (objectEqual(child, obj))
                return true;
        }
    }
    return false;
}
exports.arrayHasObj = arrayHasObj;
function equalOneOf(target, array) {
    for (const element of array) {
        if (target === element) {
            return true;
        }
    }
    return false;
}
exports.equalOneOf = equalOneOf;
function msTime(duration) {
    const millisecond = duration % 1000;
    const second = Math.floor(duration / 1000);
    const minute = Math.floor(second / 60);
    const hour = Math.floor(minute / 60);
    const day = Math.floor(hour / 24);
    const year = Math.floor(day / 365);
    return {
        millisecond: millisecond - (second * 1000),
        second: second - (minute * 60),
        minute: minute - (hour * 60),
        hour: hour - (day * 24),
        day: day - (year * 365),
        year: year
    };
}
exports.msTime = msTime;
function timestampDate(timestamp) {
    const date = new Date(timestamp);
    return `${date.getFullYear()} 年 ${date.getMonth() + 1} 月 ${date.getDate()} 日`;
}
exports.timestampDate = timestampDate;
function reply(interact, content) {
    interact.reply({ content: content, ephemeral: true });
}
exports.reply = reply;
function arrayShuffle(array) {
    var m = array.length, t, i;
    // While there remain elements to shuffle…
    while (m) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);
        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}
exports.arrayShuffle = arrayShuffle;
//# sourceMappingURL=tools.js.map