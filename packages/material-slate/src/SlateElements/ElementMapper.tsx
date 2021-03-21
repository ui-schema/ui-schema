import { RenderElementProps, RenderMapperProps } from '@ui-schema/material-slate/Slate/SlateTypings'
import { mappingBasic } from '@ui-schema/material-slate/SlateElements/mappingBasic'
import { mappingBasicInline } from '@ui-schema/material-slate/SlateElements/mappingBasicInline'
import { mappingList } from '@ui-schema/material-slate/SlateElements/mappingList'
import { mappingAdvanced } from '@ui-schema/material-slate/SlateElements/mappingAdvanced'
import { editorIsEnabled } from '@ui-schema/material-slate/Slate/editorIsEnabled'

export interface ElementMapping {
    [k: string]: (props: RenderElementProps) => JSX.Element
}

const elementMapping: ElementMapping = {
    ...mappingBasic,
    ...mappingBasicInline,
    ...mappingList,
    ...mappingAdvanced,
}

export type ElementMapperType = ({attributes, children, element}: RenderMapperProps) => JSX.Element

export const ElementMapper: ElementMapperType = (props) => {
    const {element, enableOnly} = props

    if (!editorIsEnabled(enableOnly, element.type)) {
        if (process.env.NODE_ENV === 'development') {
            console.log('editor type disabled in enableOnly for:', element.type)
        }
    }
    // eslint-disable-next-line no-prototype-builtins
    if (element.type && elementMapping.hasOwnProperty(element.type)) {
        return elementMapping[element.type](props)
    }

    if (process.env.NODE_ENV === 'development') {
        console.log('no type found for:', element.type)
    }

    return elementMapping['p'](props)
}
