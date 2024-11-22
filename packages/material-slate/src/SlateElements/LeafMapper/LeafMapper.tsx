import React from 'react'
import clsx from 'clsx'
import { RenderLeafProps } from 'slate-react'

export const LeafMapper: React.ComponentType<RenderLeafProps> = ({attributes, children, leaf}) => {
    //console.log(leaf, text)
    // @ts-ignore
    const Comp = leaf.code ? 'code' : 'span'
    return <Comp
        {...attributes}
        className={clsx([
            // @ts-ignore
            leaf.strikethrough && 'slate-strikethrough',
            // @ts-ignore
            leaf.code && 'slate-code',
            // @ts-ignore
            leaf.superscript && 'slate-superscript',
            // @ts-ignore
            leaf.subscript && 'slate-subscript',
        ])}
    >{children}</Comp>
}
