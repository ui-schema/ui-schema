import { editorEnableOnly } from '@ui-schema/material-slate/Slate/SlateRenderer'

export const editorIsEnabled = (enableOnly: editorEnableOnly | undefined, type: string | undefined): boolean => {
    return !enableOnly || !type || enableOnly.contains(type)
}
