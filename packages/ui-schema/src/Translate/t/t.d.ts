import React from "react"
import { Map } from "immutable"
import { StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'

export type translation = string | number | undefined | Function | React.ComponentType

export type Translator = (
    text: string,
    context?: Map<{}, undefined>,
    schema?: StoreSchemaType
) => translation

export const t: (
    dictionary: Map<{}, undefined>,
    locale: string
) => Translator
