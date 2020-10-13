import React from 'react';
import {useUIMeta} from '../../UIStore';

/**
 * Translation component, supports dot strings, dictionary can be mixed strings, string functions and function components as translation
 */
export const Trans = ({text, context, schema, fallback}) => {
    const {t} = useUIMeta();
    const Translated = t(text, context, schema);

    return !Translated ?
        fallback || text :
        typeof Translated === 'string' || typeof Translated === 'number' || typeof Translated === 'object' ?
            Translated :
            typeof Translated === 'function' ?
                <Translated/> :
                text
};
