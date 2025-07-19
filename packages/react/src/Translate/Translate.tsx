import { Map } from 'immutable'
import type { FC } from 'react'
import { useUIMeta } from '@ui-schema/react/UIMeta'
import type { translation, Translator, TranslatorContext } from '@ui-schema/ui-schema/Translator'

export interface TranslateProps {
    text: string
    context?: TranslatorContext
    /**
     * @todo rename to `dict`? as its just the `t` keyword, not any real schema
     */
    schema?: Map<unknown, unknown>// ValueOrImmutableOrdered<UISchema['t']>
    fallback?: translation
    // overwrite the context `t` function
    t?: Translator
}

/**
 * Translation component, supports dot strings, dictionary can be mixed strings, string functions and function components as translation
 */
export const Translate: FC<TranslateProps> = ({t: customT, text, context, schema, fallback: Fallback}) => {
    const {t} = useUIMeta()
    const Translated = customT ? customT(text, context, schema) : t(text, context, schema)

    return (
        !Translated && Translated !== 0 && Translated !== '0' ?
            typeof Fallback !== 'undefined' && Fallback !== '' ?
                typeof Fallback === 'function' ?
                    // @ts-expect-error no type cast possible, except with `createElement`, unknown implications for new react-runtime/preact compact
                    <Fallback/> :
                    // createElement(Fallback as React.FC) :
                    Fallback :
                text :
            typeof Translated === 'string' || typeof Translated === 'number' || typeof Translated === 'object' ?
                Translated :
                typeof Translated === 'function' ?
                    // @ts-expect-error no type cast possible, except with `createElement`, unknown implications for new react-runtime/preact compact
                    <Translated/> :
                    // createElement(Translated as React.FC) :
                    text
    )
}
