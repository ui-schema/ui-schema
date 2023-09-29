import * as React from 'react'
import Map from 'immutable'
import { UISchemaMap } from '@ui-schema/system/Definitions'
import { ValidatorErrorsType } from '@ui-schema/system/ValidatorErrors'

export interface ValidityHelperTextProps {
    showValidity: boolean
    errors?: ValidatorErrorsType
    schema: UISchemaMap
}

export interface LocaleHelperTextProps {
    text: string
    schema: UISchemaMap
    context?: Map<any, undefined>
    className?: string
}

export function ValidityHelperText<P extends ValidityHelperTextProps>(props: P): React.ReactElement<P>

export function LocaleHelperText<P extends LocaleHelperTextProps>(props: P): React.ReactElement<P>
