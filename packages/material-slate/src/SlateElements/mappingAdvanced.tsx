import React from 'react'
import { Transforms } from 'slate'
import Checkbox from '@material-ui/core/Checkbox'
import { ReactEditor, useSlateStatic, useReadOnly } from 'slate-react'
import { pluginOptions } from '@ui-schema/material-slate/Slate/pluginOptions'
import { ElementMapping } from '@ui-schema/material-slate/SlateElements/ElementMapper'

export const mappingAdvanced: ElementMapping = {
    // eslint-disable-next-line react/display-name
    [pluginOptions.todo_li.type]: ({element, children}) => {
        const editor = useSlateStatic()
        // @ts-ignore
        const {checked} = element
        const readOnly = useReadOnly()
        return <div contentEditable={false}>
            <Checkbox
                checked={Boolean(checked)}
                onChange={(e) => {
                    const path = ReactEditor.findPath(editor as ReactEditor, element)

                    Transforms.setNodes(
                        editor,
                        // @ts-ignore
                        {checked: e.target.checked},
                        {at: path}
                    )
                }}
                disabled={readOnly}
                size={'small'}
                style={{padding: 4}}
            />
            <span
                contentEditable={!readOnly}
                suppressContentEditableWarning
                style={{outline: 0}}
            >
                {children}
            </span>
        </div>
    },
}
