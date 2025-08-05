import { BtsBinding } from '@ui-schema/ds-bootstrap/BindingType'
import { TextRenderer } from '@ui-schema/ds-bootstrap/Widgets/TextField'
import { Select, SelectMulti } from '@ui-schema/ds-bootstrap/Widgets/Select'
import { OptionsCheck } from '@ui-schema/ds-bootstrap/Widgets/OptionsCheck'
import { OptionsRadio } from '@ui-schema/ds-bootstrap/Widgets/OptionsRadio'
import { SimpleList } from '@ui-schema/ds-bootstrap/Widgets/SimpleList'

export const widgetsExtended = {
    Text: TextRenderer,
    SimpleList: SimpleList,
    OptionsCheck: OptionsCheck,
    OptionsRadio: OptionsRadio,
    Select: Select,
    SelectMulti: SelectMulti,
} satisfies BtsBinding['widgets']
