import React from "react";
import InputAdornment from "@material-ui/core/InputAdornment";
import {NumberRenderer, StringRenderer, TextRenderer} from "../TextField/TextField";
import {Trans} from "@ui-schema/ui-schema";

const computeIcon = (schema) => {
    const icon = schema.getIn(['view', 'icon']);
    let iconEnd = schema.getIn(['view', 'iconEnd']);

    return React.useMemo(() => {
        let adornments = {};
        if(icon && (typeof iconEnd === 'boolean' && !iconEnd || typeof iconEnd !== 'boolean')) {
            adornments['startAdornment'] = <InputAdornment position="start">
                <Trans text={'icons.' + icon}/>
            </InputAdornment>;
        }

        if(typeof iconEnd !== 'boolean' && iconEnd) {
            adornments['endAdornment'] = <InputAdornment position="end">
                <Trans text={'icons.' + iconEnd}/>
            </InputAdornment>;
        }

        return adornments;
    }, [icon]);
};

const StringIconRenderer = ({schema, ...props}) => {
    const InputProps = computeIcon(schema);
    return <StringRenderer
        {...props}
        schema={schema}
        InputProps={InputProps}
    />
};

const TextIconRenderer = ({schema, ...props}) => {
    const InputProps = computeIcon(schema);
    return <TextRenderer
        {...props}
        schema={schema}
        InputProps={InputProps}
    />
};

const NumberIconRenderer = ({schema, ...props}) => {
    const InputProps = computeIcon(schema);
    return <NumberRenderer
        {...props}
        schema={schema}
        InputProps={InputProps}
    />
};

export {StringIconRenderer, TextIconRenderer, NumberIconRenderer}
