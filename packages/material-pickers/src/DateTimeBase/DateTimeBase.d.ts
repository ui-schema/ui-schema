import { onChange, OwnKey, StoreKeys } from '@ui-schema/ui-schema/UIStore'
import { required, StoreSchemaType, showValidity, valid } from '@ui-schema/ui-schema/CommonTypings'
import { additionalProps } from '@ui-schema/material-pickers/TimeBase'

export interface DateTimeBaseInterface {
    storeKeys: StoreKeys
    ownKey: OwnKey
    value: string
    onChange: onChange
    schema: StoreSchemaType
    showValidity: showValidity
    valid: valid
    required: required
    additionalProps: additionalProps
    dateFormat: string
    dateFormatData: string
    Component: React.ComponentType
    keyboard: boolean
}

export function DateTimeBase<P extends DateTimeBaseInterface>(props: P): React.ReactElement<P>
