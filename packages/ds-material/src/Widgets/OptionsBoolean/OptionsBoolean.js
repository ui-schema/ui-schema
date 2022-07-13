import React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import {grey} from '@mui/material/colors';
import {TranslateTitle} from '@ui-schema/react/TranslateTitle';
import {ValidityHelperText} from '@ui-schema/ds-material/Component';
import {useTheme} from '@mui/material/styles';

const useStyles = (theme, {error}) => ({
    switchBase: {
        color: error ? theme.palette.error.main : (theme.palette.type === 'dark' ? grey[400] : grey[50]),
    },
    track: {
        backgroundColor: error ? theme.palette.error.dark : (theme.palette.type === 'dark' ? grey[500] : grey[300]),
    },
});

export const BoolRenderer = (
    {
        value, onChange, schema, storeKeys, showValidity, valid, required, errors,
        labelledBy = undefined,
    },
) => {
    const currentVal = Boolean(value);

    const theme = useTheme()
    const styles = useStyles(theme, {error: !valid && showValidity});

    const control = <Switch
        sx={{
            '& .MuiSwitch-switchBase': styles.switchBase,
            '& .MuiSwitch-track': styles.track,
        }}
        required={required}
        checked={currentVal}
        disabled={schema.get('readOnly')}
        inputProps={{
            'aria-labelledby': labelledBy,
        }}
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
                label={<><TranslateTitle schema={schema} storeKeys={storeKeys}/>{required ? ' *' : ''}</>}
            />}
        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </>
};
