import React from 'react'
export interface MarkdownLabelInterface {
    focus: boolean
    setFocus: Function
}

export function MarkdownLabel<P extends MarkdownLabelInterface>(props: P): React.ReactElement<P>
