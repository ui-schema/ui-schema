import * as React from 'react'
import { showValidity, Errors, StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'

export interface ValidityHelperTextProps {
    showValidity: showValidity
    errors: Errors
    schema: StoreSchemaType
    browserError?: Node | React.ReactElement
}

export interface LocaleHelperTextProps {
    text: string
    schema: StoreSchemaType
    context?: any
    error?: boolean
}

export function ValidityHelperText<P extends ValidityHelperTextProps>(props: P): React.ReactElement

export function LocaleHelperText<P extends LocaleHelperTextProps>(props: P): React.ReactElement
