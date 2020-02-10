import React from "react";
import {
    makeStyles
} from "@material-ui/core";
import {beautifyKey} from "@ui-schema/ui-schema";
import {useId} from "react-id-generator";

const switchStyle = makeStyles(theme => ({
    switchBase: {
        color: ({error}) => error ? theme.palette.error.main : (theme.palette.type === 'dark' ? '#bdbdbd' : '#fafafa'),
    },
    checked: {},
    track: {
        backgroundColor: ({error}) => error ? theme.palette.error.dark : (theme.palette.type === 'dark' ? '#9e9e9e' : '#e0e0e0'),
    },
}));


const BoolRenderer = ({ownKey, value, onChange, storeKeys, showValidity, valid, required}) => {
    const currentVal = typeof value !== 'undefined' ? value : false;

    const classes = switchStyle({error: !valid && showValidity});

    return <div className={["custom-control", "custom-switch"].join(' ')}
                checked={currentVal}
                onChange={() => onChange(store => store.setIn(storeKeys, !currentVal))}
    >
        <input type="checkbox" className="custom-control-input" id={ownKey}/>
            <label className="custom-control-label" htmlFor="customSwitch1">{beautifyKey(ownKey) + (required ? ' *' : '')}</label>
    </div>;
};

const OptionCheck = ({currentValue, onChange, label}) => {
    const formId = useId(1, 'ids-')[0];

    return <div className="form-check" id={formId}>
        <label>{label}</label>
        <input className="form-check-input" type="checkbox" value={currentValue} id={formId} checked={currentValue} onChange={onChange}/>
    </div>;
};

const OptionsCheck = ({ownKey, schema, value, onChange, storeKeys, showValidity, valid, required, errors}) => {
    const enum_val = schema.get('enum');
    if(!enum_val) return null;

    return <div className="custom-control" required={required} error={!valid && showValidity}>
        <label >{beautifyKey(ownKey)}</label>
        <div className={["custom-control", "custom-checkbox"].join(' ')}>
            {enum_val ? enum_val.map((enum_name) => {
                const currentValue = value && value.contains && typeof value.contains(enum_name) !== 'undefined' ? value.contains(enum_name) : false;

                return <OptionCheck
                    key={enum_name}
                    currentValue={currentValue}
                    onChange={() => {
                        if(currentValue) {
                            onChange(store => store.setIn(storeKeys, value.delete(value.indexOf(enum_name))));
                        } else {
                            onChange(store => store.setIn(storeKeys, value.push(enum_name)));
                        }
                    }}
                    label={beautifyKey(enum_name)}
                />
            }).valueSeq() : null}
        </div>

        {showValidity && errors.size ? errors.map((error) =>
            <p>{Array.isArray(error) ? error[0] : error}</p>
        ).valueSeq() : null}
    </div>;
};

const OptionsRadio = ({ownKey, schema, value, onChange, storeKeys, showValidity, valid, required, errors}) => {
    const enum_val = schema.get('enum');
    if(!enum_val) return null;

    const currentValue = typeof value !== 'undefined' ? value : (schema.get('default') || '');

    return <div className="custom-control" required={required} error={!valid && showValidity} >
        <label >{beautifyKey(ownKey)}</label>
        <div className={["custom-control", "custom-radio"].join(' ')}>
            {enum_val ? enum_val.map((enum_name) => {
                return <div className={["custom-control", "custom-radio"].join(' ')}
                            value={enum_name}
                            checked={enum_name === currentValue}
                            onChange={() => onChange(store => store.setIn(storeKeys, enum_name))}>
                    <label>{beautifyKey(enum_name)}</label>
                    <input type="radio"/>
                    </div>
            }).valueSeq() : null}
        </div>;

        {showValidity && errors.size ? errors.map((error) =>
            <p>{Array.isArray(error) ? error[0] : error}</p>
        ).valueSeq() : null}
    </div>
};

export {OptionsRadio, OptionsCheck, BoolRenderer};
