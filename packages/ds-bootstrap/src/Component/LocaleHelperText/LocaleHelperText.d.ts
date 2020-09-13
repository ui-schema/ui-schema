import * as React from 'react'
import { errors, StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'
import Map from 'immutable'

export interface ValidityHelperTextProps {
    showValidity: boolean
    errors?: errors
    schema: StoreSchemaType
}

export interface LocaleHelperTextProps {
    text: string
    schema: StoreSchemaType
    context?: Map<any, undefined>
    className?: string
}

export function ValidityHelperText<P extends ValidityHelperTextProps>(props: P): React.ReactElement<P>

export function LocaleHelperText<P extends LocaleHelperTextProps>(props: P): React.ReactElement<P>
