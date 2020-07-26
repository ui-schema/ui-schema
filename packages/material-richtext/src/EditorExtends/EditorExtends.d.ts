import { Map } from 'immutable'

export type inlineMap = Map<string, object>
export type editorStateTo = object
export type editorStateFrom = object
export type blockRendererFn = (contentBlock: object) => Function
export type getBlockStyle = (block: object) => Function
