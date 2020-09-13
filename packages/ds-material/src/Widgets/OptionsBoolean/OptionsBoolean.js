import React from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {grey} from "@material-ui/core/colors";
import {TransTitle, updateValue} from "@ui-schema/ui-schema";
import {ValidityHelperText} from "@ui-schema/ds-material/Component";

const switchStyle = makeStyles(theme => ({
    switchBase: {
        color: ({error}) => error ? theme.palette.error.main : (theme.palette.type === 'dark' ? grey[400] : grey[50]),
    },
    checked: {},
    track: {
        backgroundColor: ({error}) => error ? theme.palette.error.dark : (theme.palette.type === 'dark' ? grey[500] : grey[300]),
    },
}));

const BoolRenderer = ({ownKey, value, onChange, schema, storeKeys, showValidity, valid, required, errors}) => {
    const currentVal = !!value;

    const classes = switchStyle({error: !valid && showValidity});
    return <>
        <FormControlLabel
            control={
                <Switch
                    classes={classes}
                    required={required}
                    checked={currentVal}
                    onChange={() => onChange(updateValue(storeKeys, !currentVal, required, schema.get('type')))}
                />
            }
            label={<><TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/>{required ? ' *' : ''}</>}
        />
        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </>
        ;
};

export {BoolRenderer};
