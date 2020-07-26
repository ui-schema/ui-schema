import { StoreKeys, onChange } from '@ui-schema/ui-schema/EditorStore'
import { schema, ColorPicker } from '@ui-schema/ui-schema/CommonTypings'

export interface ColorStaticBaseInterface {
    storeKeys: StoreKeys
    schema: schema
    value: string
    onChange: onChange
    ColorPicker: ColorPicker
    styles: object
    pickerProps: object
}

export function ColorStaticBase(props: ColorStaticBaseInterface): React.Component<ColorPicker>
