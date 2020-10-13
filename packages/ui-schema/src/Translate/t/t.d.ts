import React from 'react'
import { Map } from 'immutable'
import { StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'

export type TranslatorContext = Map<string | number, any>
export type translation = string | number | undefined | Function | React.ComponentType

export type Translator = (
    text: string,
    context?: TranslatorContext,
    schema?: StoreSchemaType
) => translation

export const t: (
    dictionary: Map<string | number, { [key: string | number]: Map<string | number, { [key: string | number]: any }> | string | number | Function | React.ComponentType }>,
    locale?: string
) => Translator
