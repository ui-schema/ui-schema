import { Map } from 'immutable'
import { UISchema } from '@ui-schema/json-schema/Definitions'
import { ValueOrImmutableOrdered } from '@ui-schema/system/createMap'

export type TranslatorContext = Map<string | number, any>
export type translation = string | number | undefined

export type Translator<T = translation> = (
    text: string,
    context?: TranslatorContext,
    schema?: ValueOrImmutableOrdered<UISchema['t']>
) => T

// @todo: somehow allow adding further specifics, e.g. `React.ComponentType` in `/react`
export type TranslatorDictionary = Map<string | number, Map<string | number, { [key: string | number]: any }> | string | number | Function/* | React.ComponentType*/>
