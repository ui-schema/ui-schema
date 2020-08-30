import { StoreKeys, onChange } from '@ui-schema/ui-schema/EditorStore'
import { StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'

export interface ColorStaticBaseInterface {
    storeKeys: StoreKeys
    schema: StoreSchemaType
    value: string
    onChange: onChange
    ColorPicker: React.ComponentType
    styles: object
    pickerProps: object
}

export function ColorStaticBase(props: ColorStaticBaseInterface): React.ReactElement
