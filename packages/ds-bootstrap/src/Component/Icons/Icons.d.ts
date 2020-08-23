import * as React from 'react'

export interface Icon {
    onClick: Function
    label: string
    iconName: string
    btnSize: string
}

export function IconPlus<P extends Icon>(props: P): React.Component<P>

export function IconMinus<P extends Icon>(props: P): React.Component<P>
