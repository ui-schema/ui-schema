import { Map } from 'immutable'
import { UISchema } from '@ui-schema/system/Definitions'
import { ValueOrImmutableOrdered } from '@ui-schema/system/createMap'

export type TranslatorContext = Map<string | number, any>
export type translation = string | number | undefined

export type Translator<T = translation> = (
    text: string,
    context?: TranslatorContext,
    schema?: ValueOrImmutableOrdered<UISchema['t']>
) => T

export type TranslatorDictionary<T = translation> = Map<string | number, Map<string | number, { [key: string | number]: any }> | T>
