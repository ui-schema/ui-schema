import { onChange, StoreKeys } from '@ui-schema/ui-schema/EditorStore'
import { ownKey, required, schema, showValidity, valid } from '@ui-schema/ui-schema/CommonTypings'
import { additionalProps } from '@ui-schema/material-pickers/TimeBase'

export interface DateTimeBaseInterface {
    storeKeys: StoreKeys
    ownKey: ownKey
    value: string
    onChange: onChange
    schema: schema
    showValidity: showValidity
    valid: valid
    required: required
    additionalProps: additionalProps
    dateFormat: string
    dateFormatData: string
    Component: React.Component
    keyboard: boolean
}

export function DateTimeBase<P extends DateTimeBaseInterface>(props: P): React.Component<P>
