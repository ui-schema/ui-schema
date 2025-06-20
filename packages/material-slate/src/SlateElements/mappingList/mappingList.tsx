import React from 'react'
import { pluginOptions } from '@ui-schema/material-slate/Slate/pluginOptions'
import { ElementMapping } from '@ui-schema/material-slate/SlateElements/ElementMapper'

export const mappingList: ElementMapping = {
    [pluginOptions.ul.type]: ({attributes, children}) => <ul {...attributes}>{children}</ul>,
    [pluginOptions.ol.type]: ({attributes, children}) => <ol {...attributes}>{children}</ol>,
    [pluginOptions.li.type]: ({attributes, children}) => <li {...attributes}>{children}</li>,
}
