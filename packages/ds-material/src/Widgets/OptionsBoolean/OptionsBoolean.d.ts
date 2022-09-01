import * as React from 'react'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { SwitchProps } from '@mui/material/Switch'

export function BoolRenderer(
    props: WidgetProps & {
        labelledBy?: string
        checkedIcon?: SwitchProps['checkedIcon']
        edge?: SwitchProps['edge']
        icon?: SwitchProps['icon']
    },
): React.ReactElement
