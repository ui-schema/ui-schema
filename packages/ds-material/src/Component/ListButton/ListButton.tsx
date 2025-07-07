import { AccessTooltipIcon } from '@ui-schema/ds-material/Component/Tooltip'
import Button, { ButtonProps } from '@mui/material/Button'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import React from 'react'

export interface ListButtonOverwrites {
    btnSize?: IconButtonProps['size']
    // only for `Button`, not for `IconButton`
    btnVariant?: ButtonProps['variant']
    btnColor?: ButtonProps['color']
}

export interface ListButtonProps extends ListButtonOverwrites {
    onClick: () => void
    Icon?: React.ComponentType<{
        fontSize?: 'inherit' | 'small' | 'medium' | 'large'
        style?: React.CSSProperties
    }>
    title: React.ReactElement | string
    style?: React.CSSProperties
    showLabel?: boolean
}

export const ListButton: React.ComponentType<ListButtonProps> = (
    {
        onClick,
        Icon, title,
        btnSize, btnVariant, btnColor,
        style, showLabel,
    }
) => {
    return <>
        {!showLabel && Icon ?
            <IconButton
                onClick={onClick}
                size={btnSize} color={btnColor}
                style={style}
            >
                <AccessTooltipIcon title={title}>
                    <Icon
                        fontSize={'inherit'}
                        style={{margin: btnSize === 'small' ? 2 : undefined}}
                    />
                </AccessTooltipIcon>
            </IconButton> :
            <Button
                onClick={onClick}
                size={btnSize} color={btnColor}
                variant={btnVariant}
                style={style}
                startIcon={Icon ? <Icon fontSize={'inherit'}/> : undefined}
            >
                {title}
            </Button>}
    </>
}
