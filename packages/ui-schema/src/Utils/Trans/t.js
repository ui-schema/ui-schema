import {relT} from "./relT";

/**
 * Dictionary Factory
 * pass in the dictionary that should be used, returns a new function that can work with it.
 * - supports strings or functions as translation
 * - supports relative schema translation (keyword `t`)
 * - translation results should either be strings or React Components
 *
 * @param {Map} dictionary imputable map with translations for one language
 * @param {string} locale
 * @return {function(string, {}): string|React.Component}
 */
export const t = (dictionary, locale = '') =>
    (text, context = {}, schema) => {
        const schemaT = relT(schema, context, locale);
        if(schemaT) return schemaT;

        let trans = dictionary.getIn(text.split('.'));

        if(typeof trans === 'function') {
            return trans(context);
        }

        return trans;
    };
