import {Map} from 'immutable';

/**
 *
 * @param {string} str
 * @param search
 * @param replacement
 * @return {string}
 */
const strReplaceAll = (str, search, replacement) => {
    return str.split(search).join(replacement);
};

/**
 * Runtime Cache: strReplace, split, join etc. in that amount on every re-render could lead to performance problems
 * As each input results in the same output, an easy key-value cache is used
 *
 * @type {Map}
 */
const beautified = Map();

const beautifyKey = (name) => {
    let tmp = beautified.get(name);
    if(tmp) {
        return tmp;
    }

    let beauty = strReplaceAll(
        strReplaceAll(
            strReplaceAll(
                strReplaceAll(name, '__', ' '),
                '_', ' '),
            '.', ' '),
        '-', ' ')
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))// make first letter uppercase
        .join(' ');

    beautified.set(name, beauty);

    return beauty
};

export {beautifyKey, strReplaceAll};
