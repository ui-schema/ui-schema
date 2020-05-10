import * as React from 'react'
import { OrderedMap, List } from 'immutable'

export interface ValidityHelperTextProps {
    showValidity: boolean
    errors?: List<string>
    schema: OrderedMap<{}, undefined>
}

export interface LocaleHelperTextProps {
    text: string
    schema: OrderedMap<{}, undefined>
    context: any
    className: string
}

export function ValidityHelperText<P extends ValidityHelperTextProps>(props: P): React.Component<P>

export function LocaleHelperText<P extends LocaleHelperTextProps>(props: P): React.Component<P>
