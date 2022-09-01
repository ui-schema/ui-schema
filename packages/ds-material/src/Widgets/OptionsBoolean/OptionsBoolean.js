import React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import {TransTitle} from '@ui-schema/ui-schema/Translate/TransTitle';
import {ValidityHelperText} from '@ui-schema/ds-material/Component';

export const BoolRenderer = (
    {
        value, onChange, schema, storeKeys, showValidity, valid, required, errors,
        labelledBy = undefined,
        checkedIcon, edge, icon,
    },
) => {
    const currentVal = Boolean(value);

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
        color={schema.getIn(['view', 'color'])}
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
                labelPlacement={schema.getIn(['view', 'labelPlacement'])}
                componentsProps={{
                    typography: {
                        variant:
                            schema.getIn(['view', 'titleVariant']) ||
                            (schema.getIn(['view', 'dense']) ? 'body2' : undefined),
                    },
                }}
                label={<><TransTitle schema={schema} storeKeys={storeKeys}/>{required ? ' *' : ''}</>}
            />}
        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </>
};
