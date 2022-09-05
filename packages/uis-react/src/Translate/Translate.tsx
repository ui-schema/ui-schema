import React from 'react'
import { useUIMeta } from '@ui-schema/react/UIMeta'
import { translation, Translator, TranslatorContext } from '@ui-schema/system/Translator'
import { UISchema } from '@ui-schema/json-schema/Definitions'
import { ValueOrImmutableOrdered } from '@ui-schema/system/createMap'

export interface TranslateProps {
    text: string
    context?: TranslatorContext
    schema?: ValueOrImmutableOrdered<UISchema['t']>
    fallback?: translation
    // overwrite the context `t` function
    t?: Translator
}

/**
 * Translation component, supports dot strings, dictionary can be mixed strings, string functions and function components as translation
 */
export const Translate: React.FC<TranslateProps> = ({t: customT, text, context, schema, fallback}) => {
    const {t} = useUIMeta()
    const Translated = customT ? customT(text, context, schema) : t(text, context, schema)

    return (
        !Translated && Translated !== 0 && Translated !== '0' ?
            typeof fallback !== 'undefined' && fallback !== '' ? fallback : text :
            typeof Translated === 'string' || typeof Translated === 'number' || typeof Translated === 'object' ?
                Translated :
                typeof Translated === 'function' ?
                    <Translated/> :
                    text
    ) as unknown as React.ReactElement
}
