import * as React from 'react'
import { Map } from 'immutable'

export interface RichTextProps {
    editorState: Map<any, any>
    handleChange: Function
}

export type RichTextContext = React.Context<RichTextProps>

export function RichTextProvider(props: React.PropsWithChildren<RichTextProps>): React.ReactElement

export function useRichText(): RichTextProps
