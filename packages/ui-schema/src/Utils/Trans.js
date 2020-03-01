import {useEditor} from "../Schema/EditorStore";
import React from "react";

/**
 * Dictionary Factory
 * pass in the dictionary that should be used, returns a new function that can work with it.
 * supports strings or functions as translation
 * translation results should either be strings or React Components
 *
 * @param {Map} dictionary imputable map with translations for one language
 * @return {function(string, {}): string|React.Component}
 */
const t = dictionary =>
    (text, context = {}) => {
        let trans = dictionary.getIn(text.split('.'));

        if(typeof trans === 'function') {
            return trans(context);
        }

        return trans || text;
    };

/**
 * Translation component, supports dot strings, dictionary can be mixed strings, string functions and function components as translation
 * @param text
 * @param context
 * @return {*}
 * @constructor
 */
const Trans = ({text, context}) => {
    const {t} = useEditor();
    const Translated = t(text, context);

    return typeof Translated === 'string' || typeof Translated === 'number' || typeof Translated === 'object' ?
        Translated :
        typeof Translated === 'function' ?
            <Translated/> :
            text
};

export {t, Trans}
