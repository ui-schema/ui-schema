import React from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import {NumberRenderer, StringRenderer, TextRenderer} from '@ui-schema/ds-material/Widgets/TextField';
import {Translate} from '@ui-schema/react/Translate';

const useComputeIcon = (schema, baseInputProps) => {
    const icon = schema.getIn(['view', 'icon']);
    let iconEnd = schema.getIn(['view', 'iconEnd']);

    return React.useMemo(() => {
        let inputProps = baseInputProps || {};
        if(icon && (typeof iconEnd === 'boolean' && !iconEnd || typeof iconEnd !== 'boolean')) {
            inputProps['startAdornment'] = <InputAdornment position="start">
                <Translate text={'icons.' + icon}/>
            </InputAdornment>;
        }

        if(typeof iconEnd !== 'boolean' && iconEnd) {
            inputProps['endAdornment'] = <InputAdornment position="end">
                <Translate text={'icons.' + iconEnd}/>
            </InputAdornment>;
        }

        return inputProps;
    }, [icon, iconEnd, baseInputProps]);
};

const StringIconRenderer = ({schema, ...props}) => {
    const InputProps = useComputeIcon(schema, props.InputProps);
    return <StringRenderer
        {...props}
        schema={schema}
        InputProps={InputProps}
    />
};

const TextIconRenderer = ({schema, ...props}) => {
    const InputProps = useComputeIcon(schema, props.InputProps);
    return <TextRenderer
        {...props}
        schema={schema}
        InputProps={InputProps}
    />
};

const NumberIconRenderer = ({schema, ...props}) => {
    const InputProps = useComputeIcon(schema, props.InputProps);
    return <NumberRenderer
        {...props}
        schema={schema}
        InputProps={InputProps}
    />
};

export {StringIconRenderer, TextIconRenderer, NumberIconRenderer}
