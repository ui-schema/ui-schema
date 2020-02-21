import React from "react";

import {unstable_trace as trace} from "scheduler/tracing";
import {beautifyKey} from "@ui-schema/ui-schema";
import {ValidityHelperText} from "../Component/LocaleHelperText";

const StringRenderer = ({ownKey, schema, value, multiline, rows, onChange, storeKeys, showValidity, required, errors}) => {

    let Renderer = 'input';
    if(multiline) {
        Renderer = 'textarea';
    }

    return <div className={"form-group"}>
        <label htmlFor={ownKey}>{beautifyKey(ownKey)}</label>
        <Renderer
            className={"form-control"}
            required={required}
            rows={rows}
            value={value || ''}
            onChange={(e) => trace("textfield onchange", performance.now(), () => {
                onChange(store => store.setIn(storeKeys, e.target.value));
            })}/>
        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </div>;
};

/* const TextRenderer = ({schema, ...props}) => {
    return <StringRenderer
        {...props}
        schema={schema}
        rows={schema.getIn(['view', 'rows'])}
        multiline
    />
};

const NumberRenderer = ({schema, ...props}) => {
    return <StringRenderer
        {...props}
        schema={schema}
        type={'number'}
        onChange={(e) => {
                    if(isNaN(e.target.value * 1)) {
                        console.error('Invalid Type: input not a number in:', e.target);
                        return;
                    }
        })}
    />
}; */

export {StringRenderer /*, NumberRenderer, TextRenderer */};
