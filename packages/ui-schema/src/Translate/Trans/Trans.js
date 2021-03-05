import React from 'react';
import {useUIMeta} from '../../UIStore';

/**
 * Translation component, supports dot strings, dictionary can be mixed strings, string functions and function components as translation
 */
let TransBase = ({text, context, schema, fallback, t}) => {
    const Translated = t(text, context, schema);

    return !Translated && Translated !== 0 && Translated !== '0' ?
        typeof fallback !== 'undefined' && fallback !== '' ? fallback : text :
        typeof Translated === 'string' || typeof Translated === 'number' || typeof Translated === 'object' ?
            Translated :
            typeof Translated === 'function' ?
                <Translated/> :
                text
};

// here this memo is enough, doesn't need immutable compatible memo
TransBase = React.memo(TransBase)

export const Trans = ({text, context, schema, fallback}) => {
    const {t} = useUIMeta();

    return <TransBase
        text={text}
        context={context}
        schema={schema}
        fallback={fallback}
        t={t}
    />
};
