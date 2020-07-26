import React from "react";
import {DateTimePicker as MuiDateTimePicker, KeyboardDateTimePicker,} from '@material-ui/pickers';
import {addAdditionalProps} from "../TimeBase/TimeBase";
import {DateTimeBase} from "../DateTimeBase/DateTimeBase";

const KeyboardButtonProps = {
    'aria-label': 'change date time',
};

export const DateTimePicker = ({
                                   schema, ...props
                               }) => {
    const dateFormat = schema.getIn(['date', 'format']) || 'yyyy-MM-dd HH:mm';
    const dateFormatData = schema.getIn(['date', 'formatData']) || dateFormat;

    const keyboard = schema.getIn(['date', 'keyboard']) !== false;
    let Component = keyboard ? KeyboardDateTimePicker : MuiDateTimePicker;

    let additionalProps = {};
    if(keyboard) {
        additionalProps['KeyboardButtonProps'] = KeyboardButtonProps;
    }
    additionalProps = {
        additionalProps,
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

