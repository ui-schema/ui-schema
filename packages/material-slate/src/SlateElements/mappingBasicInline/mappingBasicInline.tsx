import React from 'react'
import { pluginOptions } from '@ui-schema/material-slate/Slate/pluginOptions'
import { ElementMapping } from '@ui-schema/material-slate/SlateElements/ElementMapper'
import { mappingAlign } from '@ui-schema/material-slate/SlateElements/mappingAlign'

export const mappingBasicInline: ElementMapping = {
    [pluginOptions.code_line.type]: ({attributes, children}) => <div {...attributes}>{children}</div>,
    'span': ({attributes, children}) => <span {...attributes} style={{display: 'block'}}>{children}</span>,
    ...mappingAlign,
}
