import React from 'react'
import { translation, TranslatorContext } from '@ui-schema/system/Translator'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'

export interface TranslateProps {
    text: string
    context?: TranslatorContext
    schema?: UISchemaMap
    fallback?: translation
}

/**
 * Translation component, supports dot strings, dictionary can be mixed strings, string functions and function components as translation
 */
export function Translate<P extends TranslateProps>(props: P): React.ReactElement
