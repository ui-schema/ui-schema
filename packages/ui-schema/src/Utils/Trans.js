import React from "react";
import {Map, List} from "immutable";
import {useEditor} from "../Schema/EditorStore";
import {beautifyKey} from "./beautify";

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
const t = (dictionary, locale = '') =>
    (text, context = {}, schema) => {
        const schemaT = relT(schema, context, locale);
        if(schemaT) return schemaT;

        let trans = dictionary.getIn(text.split('.'));

        if(typeof trans === 'function') {
            return trans(context);
        }

        return trans;
    };

const relT = (schema, context, locale) => {
    if(Map.isMap(schema) && context && context.get('relative')) {
        const relSchema = locale ? schema.get(locale) : schema;
        if(relSchema) {
            const schemaT = relSchema.getIn(context.get('relative'));
            if(schemaT) return schemaT;
        }
    }

    return undefined;
};

/**
 * Translation component, supports dot strings, dictionary can be mixed strings, string functions and function components as translation
 * @param text
 * @param context
 * @param fallback
 * @param {undefined|Map} schema
 * @return {*}
 * @constructor
 */
const Trans = ({text, context, schema, fallback}) => {
    const {t} = useEditor();
    const Translated = t(text, context, schema);

    return !Translated ?
        fallback || text :
        typeof Translated === 'string' || typeof Translated === 'number' || typeof Translated === 'object' ?
            Translated :
            typeof Translated === 'function' ?
                <Translated/> :
                text
};

/**
 * Reusable title translation component
 * @param {Map} schema
 * @param {Map} storeKeys
 * @param {string} ownKey
 * @return {*}
 * @constructor
 */
const TransTitle = ({schema, storeKeys, ownKey}) => <Trans
    schema={schema.get('t')}
    text={storeKeys.insert(0, 'widget').push('title').join('.')}
    context={Map({'relative': List(['title'])})}
    fallback={beautifyKey(ownKey, schema.get('tt'))}
/>;

export {t, Trans, TransTitle, relT}
