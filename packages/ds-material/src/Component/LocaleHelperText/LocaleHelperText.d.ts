import * as React from 'react'
import { showValidity, errors, schema } from '@ui-schema/ui-schema/CommonTypings'

export interface ValidityHelperTextProps {
    showValidity: showValidity
    errors: errors
    schema: schema
    browserError: Node
}

export interface LocaleHelperTextProps {
    text: string
    schema: schema
    context: any
    error: false
}

export function ValidityHelperText<P extends ValidityHelperTextProps>(props: P): React.Component<P>

export function LocaleHelperText<P extends LocaleHelperTextProps>(props: P): React.Component<P>
