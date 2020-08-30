import * as React from 'react'
import { showValidity, errors, StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'

export interface ValidityHelperTextProps {
    showValidity: showValidity
    errors: errors
    schema: StoreSchemaType
    browserError: Node
}

export interface LocaleHelperTextProps {
    text: string
    schema: StoreSchemaType
    context: any
    error: false
}

export function ValidityHelperText<P extends ValidityHelperTextProps>(props: P): React.ReactElement

export function LocaleHelperText<P extends LocaleHelperTextProps>(props: P): React.ReactElement
