import { Map } from 'immutable'

export type TranslatorContext = Map<string | number, any>
export type translation = string | number | undefined | Function

export type Translator<TTranslation extends translation = translation> = (
    text: string,
    context?: TranslatorContext,
    schema?: Map<unknown, unknown>,
) => TTranslation

export type TranslatorDictionary<TTranslation extends translation = translation> = Map<string | number, Map<string | number, { [key: string | number]: any }> | TTranslation>
