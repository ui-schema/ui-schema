import * as React from 'react'

export interface EditorControlsInterface {
    focused: boolean
    showBlockControl: boolean
    topControls: boolean
    dense: boolean
    btnSize: number
}

export function EditorControls<P extends EditorControlsInterface>(props: P): React.Component<P>
