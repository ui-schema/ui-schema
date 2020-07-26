import { Map } from 'immutable'

export function getBlockStyle(block: object): string | null

export interface styleMap {
    CODE: {}
}

export type inlineMap = Map<string, object>
export type editorStateTo = object
export type editorStateFrom = object
export type blockRendererFn = (contentBlock: object) => {}
