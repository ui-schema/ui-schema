import React from 'react'
import { Transforms } from 'slate'
import { ReactEditor, useSlateStatic, useReadOnly } from 'slate-react'
import Typography from '@material-ui/core/Typography'
import { RenderElementProps } from '@ui-schema/material-slate/Slate/SlateTypings'

export interface ElementMapping {
    [k: string]: (props: RenderElementProps) => JSX.Element
}

const mappingBasic: ElementMapping = {
    // eslint-disable-next-line react/display-name
    'heading-one': ({attributes, children}) => <Typography
        variant={'h1'} component={'h1'}
        {...attributes}
        style={{fontSize: '2.7rem'}} gutterBottom
    >{children}</Typography>,
    // eslint-disable-next-line react/display-name
    'heading-two': ({attributes, children}) => <Typography
        variant={'h2'} component={'h2'}
        {...attributes}
        style={{fontSize: '2.3rem'}} gutterBottom
    >{children}</Typography>,
    // eslint-disable-next-line react/display-name
    'heading-three': ({attributes, children}) => <Typography
        variant={'h3'} component={'h3'}
        {...attributes}
        style={{fontSize: '2.1rem'}} gutterBottom
    >{children}</Typography>,
    // eslint-disable-next-line react/display-name
    'heading-four': ({attributes, children}) => <Typography
        variant={'h4'} component={'h4'}
        {...attributes}
        style={{fontSize: '1.75rem'}} gutterBottom
    >{children}</Typography>,
    // eslint-disable-next-line react/display-name
    'heading-five': ({attributes, children}) => <Typography
        variant={'h5'} component={'h5'}
        {...attributes}
        style={{fontSize: '1.5rem'}} gutterBottom
    >{children}</Typography>,
    // eslint-disable-next-line react/display-name
    'heading-six': ({attributes, children}) => <Typography
        variant={'h6'} component={'h6'}
        {...attributes}
        style={{fontSize: '1.25rem'}} gutterBottom
    >{children}</Typography>,
    // eslint-disable-next-line react/display-name
    'p': ({attributes, children}) => <Typography
        variant={'body1'} component={'p'}
        {...attributes}
        style={{lineHeight: 'normal'}} gutterBottom
    >{children}</Typography>,
}

const mappingBasicPlus: ElementMapping = {
    // eslint-disable-next-line react/display-name
    'block-quote': ({attributes, children}) => <blockquote {...attributes}>{children}</blockquote>,
    // eslint-disable-next-line react/display-name
    'blockquote': ({attributes, children}) => <blockquote {...attributes}>{children}</blockquote>,
    // eslint-disable-next-line react/display-name
    'code_block': ({attributes, children}) => <pre {...attributes}><code>{children}</code></pre>,
    // eslint-disable-next-line react/display-name
    'code_line': ({attributes, children}) => <div {...attributes}>{children}</div>,
}

const mappingList: ElementMapping = {
    // eslint-disable-next-line react/display-name
    'ul': ({attributes, children}) => <ul {...attributes}>{children}</ul>,
    // eslint-disable-next-line react/display-name
    'ol': ({attributes, children}) => <ol {...attributes}>{children}</ol>,
    // eslint-disable-next-line react/display-name
    'li': ({attributes, children}) => <li {...attributes}>{children}</li>,
}

const mappingAlign: ElementMapping = {
    // eslint-disable-next-line react/display-name
    'align_center': ({attributes, children}) => <div {...attributes} style={{textAlign: 'center'}}>{children}</div>,
    // eslint-disable-next-line react/display-name
    'align_right': ({attributes, children}) => <div {...attributes} style={{textAlign: 'right'}}>{children}</div>,
    // eslint-disable-next-line react/display-name
    'align_justify': ({attributes, children}) => <div {...attributes} style={{textAlign: 'justify', whiteSpace: 'normal'}}>{children}</div>,
}

const mappingAdvanced: ElementMapping = {
    // eslint-disable-next-line react/display-name
    'action_item': ({element, children}) => {
        const editor = useSlateStatic()
        // @ts-ignore
        const {checked} = element
        const readOnly = useReadOnly()
        return <div contentEditable={false}>
            <input
                //className={classNames.checkbox}
                type="checkbox"
                checked={!!checked}
                onChange={(e) => {
                    const path = ReactEditor.findPath(editor, element)

                    Transforms.setNodes(
                        editor,
                        // @ts-ignore
                        {checked: e.target.checked},
                        {at: path}
                    )
                }}
            />
            <span
                contentEditable={!readOnly}
                suppressContentEditableWarning
            >
                {children}
            </span>
        </div>
    },
}

const elementMapping = {
    ...mappingBasic,
    ...mappingBasicPlus,
    ...mappingList,
    ...mappingAlign,
    ...mappingAdvanced,
}

export type ElementMapperType = ({attributes, children, element}: RenderElementProps) => JSX.Element

export const ElementMapper: ElementMapperType = (props) => {
    const {element} = props
    // eslint-disable-next-line no-prototype-builtins
    if (element.type && elementMapping.hasOwnProperty(element.type)) {
        return elementMapping[element.type](props)
    }
    console.log('no type found for:', element.type)
    return elementMapping['p'](props)
}
