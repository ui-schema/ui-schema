import { Map } from 'immutable'
import { EditorState } from 'draft-js'

export function getBlockStyle(block: object): string | null

export const styleMap: {
    CODE: { [key: string]: string | number | boolean | null }
}

export const inlineMap: Map<string, object>

export const editorStateTo: {
    raw: (editorState: EditorState) => string
    markdown: (editorState: EditorState) => string
}

export const editorStateFrom: {
    markdown: (markdown: string) => EditorState
}

export function blockRendererFn(contentBlock: object): {}
