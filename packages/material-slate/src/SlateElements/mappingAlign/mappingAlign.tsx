import React from 'react'
import { pluginOptions } from '@ui-schema/material-slate/Slate/pluginOptions'
import { ElementMapping } from '@ui-schema/material-slate/SlateElements/ElementMapper'

export const mappingAlign: ElementMapping = {
    [pluginOptions.align_center.type]: ({attributes, children}) => <div {...attributes} style={{textAlign: 'center'}}>{children}</div>,
    [pluginOptions.align_right.type]: ({attributes, children}) => <div {...attributes} style={{textAlign: 'right'}}>{children}</div>,
    [pluginOptions.align_justify.type]: ({attributes, children}) => <div {...attributes} style={{textAlign: 'justify', whiteSpace: 'normal'}}>{children}</div>,
}
