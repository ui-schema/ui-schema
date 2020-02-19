import {useSchemaTrans} from "../Schema/EditorStore";
import React from "react";

/*
const dictionary = createMap({
    error: {
        // usage with simple string
        'required-not-set': 'Please fill out this field',

        // usage with function that generates the string, using the context
        'multiple-of': ({multipleOf}) => `Must be multiple of ${multipleOf}`,

        // usage with function, using the context, producing a React functional component
        'multiple-of': ({multipleOf}) => () => <span>Must be multiple of <u>{multipleOf}</u></span>,
    }
});
*/

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
    const {t} = useSchemaTrans();
    const Translated = t(text, context);

    return typeof Translated === 'string' || typeof Translated === 'number' ?
        Translated :
        typeof Translated === 'function' || typeof Translated === 'object' ?
            <Translated/> :
            text
};

export {t, Trans}
