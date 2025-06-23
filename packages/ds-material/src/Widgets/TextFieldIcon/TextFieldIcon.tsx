import React from 'react'
import InputAdornment from '@mui/material/InputAdornment'
import { NumberRenderer, NumberRendererProps, StringRenderer, StringRendererProps, TextRenderer, TextRendererProps } from '@ui-schema/ds-material/Widgets/TextField'
import { Translate } from '@ui-schema/react/Translate'
import { WidgetProps } from '@ui-schema/react/Widgets'

const useComputeIcon = (schema, baseInputProps) => {
    const icon = schema.getIn(['view', 'icon'])
    const iconEnd = schema.getIn(['view', 'iconEnd'])

    return React.useMemo(() => {
        const inputProps = baseInputProps || {}
        if (icon && (typeof iconEnd === 'boolean' && !iconEnd || typeof iconEnd !== 'boolean')) {
            inputProps['startAdornment'] = <InputAdornment position="start">
                <Translate text={'icons.' + icon}/>
            </InputAdornment>
        }

        if (typeof iconEnd !== 'boolean' && iconEnd) {
            inputProps['endAdornment'] = <InputAdornment position="end">
                <Translate text={'icons.' + iconEnd}/>
            </InputAdornment>
        }

        return inputProps
    }, [icon, iconEnd, baseInputProps])
}

export const StringIconRenderer: React.FC<WidgetProps & StringRendererProps> = ({schema, ...props}) => {
    const InputProps = useComputeIcon(schema, props.InputProps)
    return <StringRenderer
        {...props}
        schema={schema}
        InputProps={InputProps}
    />
}

export const TextIconRenderer: React.FC<WidgetProps & TextRendererProps> = ({schema, ...props}) => {
    const InputProps = useComputeIcon(schema, props.InputProps)
    return <TextRenderer
        {...props}
        schema={schema}
        InputProps={InputProps}
    />
}

export const NumberIconRenderer: React.FC<WidgetProps & NumberRendererProps> = ({schema, ...props}) => {
    const InputProps = useComputeIcon(schema, props.InputProps)
    return <NumberRenderer
        {...props}
        schema={schema}
        InputProps={InputProps}
    />
}
