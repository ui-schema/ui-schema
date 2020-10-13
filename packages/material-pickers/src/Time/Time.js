import React from "react";
import {TimePicker as MuiTimePicker, KeyboardTimePicker,} from '@material-ui/pickers';
import {addAdditionalProps} from "../TimeBase/TimeBase";
import {DateTimeBase} from "../DateTimeBase/DateTimeBase";

const KeyboardButtonProps = {
    'aria-label': 'change time',
};

export const TimePicker = ({
                        schema, ...props
                    }) => {
    const dateFormat = schema.getIn(['date', 'format']) || 'HH:mm';
    const dateFormatData = schema.getIn(['date', 'formatData']) || dateFormat;

    const keyboard = schema.getIn(['date', 'keyboard']) !== false;
    let Component = keyboard ? KeyboardTimePicker : MuiTimePicker;

    let additionalProps = {};
    if(keyboard) {
        additionalProps['KeyboardButtonProps'] = KeyboardButtonProps;
    }
    additionalProps = {
        ...additionalProps,
        ...addAdditionalProps(schema)
    };

    return <DateTimeBase
        dateFormat={dateFormat}
        dateFormatData={dateFormatData}
        additionalProps={additionalProps}
        Component={Component}
        schema={schema}
        keyboard={keyboard}
        {...props}
    />
};
