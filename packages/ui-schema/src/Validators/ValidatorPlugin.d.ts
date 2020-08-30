import { EditorPluginProps } from '@ui-schema/ui-schema/EditorPlugin'

export interface ValidatorPlugin {
    validate: (props: Partial<EditorPluginProps>) => Partial<EditorPluginProps>
    noValidate?: (props: Partial<EditorPluginProps>) => Partial<EditorPluginProps>
    should?: (props: Partial<EditorPluginProps>) => boolean
}
