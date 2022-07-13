import { Map } from 'immutable'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'

export type TranslatorContext = Map<string | number, any>
// @todo: somehow allow adding further specifics, e.g. `React.ComponentType` in `/react`
export type translation = string | number | undefined | Function// | React.ComponentType

export type Translator = (
    text: string,
    context?: TranslatorContext,
    schema?: UISchemaMap
) => translation

// @todo: somehow allow adding further specifics, e.g. `React.ComponentType` in `/react`
export type TranslatorDictionary = Map<string | number, Map<string | number, { [key: string | number]: any }> | string | number | Function/* | React.ComponentType*/>
