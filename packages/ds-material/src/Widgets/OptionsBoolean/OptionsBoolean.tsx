import React from 'react'
import FormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'
import Switch, { SwitchProps } from '@mui/material/Switch'
import { TranslateTitle } from '@ui-schema/react/TranslateTitle'
import { ValidityHelperText } from '@ui-schema/ds-material/Component'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { WithScalarValue } from '@ui-schema/react/UIStore'
import { TypographyProps } from '@mui/material/Typography'

export const BoolRenderer: React.FC<WidgetProps & WithScalarValue & {
    labelledBy?: string
    checkedIcon?: SwitchProps['checkedIcon']
    edge?: SwitchProps['edge']
    icon?: SwitchProps['icon']
}> = (
    {
        value, onChange, schema, storeKeys, showValidity, valid, required, errors,
        labelledBy = undefined,
        checkedIcon, edge, icon,
    },
) => {
    const currentVal = Boolean(value)

    const iconProps = {
        ...(checkedIcon ? {
            checkedIcon: checkedIcon,
        } : {}),
        ...(icon ? {
            icon: icon,
        } : {}),
    }
    const control = <Switch
        sx={{
            '& .MuiSwitch-switchBase': {
                color: !valid && showValidity ? 'error.main' : undefined,
            },
            '& .MuiSwitch-track': {
                backgroundColor: !valid && showValidity ? 'error.dark' : undefined,
            },
        }}
        color={schema.getIn(['view', 'color']) as SwitchProps['color']}
        required={required}
        checked={currentVal}
        disabled={schema.get('readOnly')}
        inputProps={{
            'aria-labelledby': labelledBy,
        }}
        size={schema.getIn(['view', 'dense']) ? 'small' : undefined}
        edge={edge}
        {...iconProps}
        onChange={() =>
            onChange({
                storeKeys,
                scopes: ['value'],
                type: 'update',
                updater: ({value: storeValue}) => ({value: !storeValue}),
                schema,
                required,
            })
        }
    />

    return <>
        {schema.getIn(['view', 'hideTitle']) ?
            control :
            <FormControlLabel
                disabled={schema.get('readOnly')}
                control={control}
                labelPlacement={schema.getIn(['view', 'labelPlacement']) as FormControlLabelProps['labelPlacement']}
                componentsProps={{
                    typography: {
                        variant:
                            schema.getIn(['view', 'titleVariant']) as TypographyProps['variant'] ||
                            (schema.getIn(['view', 'dense']) ? 'body2' : undefined),
                    },
                }}
                label={<><TranslateTitle schema={schema} storeKeys={storeKeys}/>{required ? ' *' : ''}</>}
            />}
        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </>
}
