import React from "react";
import {DatePicker as MuiDatePicker, KeyboardDatePicker,} from '@material-ui/pickers';
import {DateTimeBase} from "./DateTimeBase";

const KeyboardButtonProps = {
    'aria-label': 'change date',
};

const DatePicker = ({
                        schema, ...props
                    }) => {
    const dateFormat = schema.getIn(['date', 'format']) || 'yyyy-MM-dd';
    const dateFormatData = schema.getIn(['date', 'formatData']) || dateFormat;

    const keyboard = schema.getIn(['date', 'keyboard']) !== false;
    let Component = keyboard ? KeyboardDatePicker : MuiDatePicker;

    const additionalProps = {};
    if(keyboard) {
        additionalProps['KeyboardButtonProps'] = KeyboardButtonProps;
    }
    additionalProps['orientation'] = schema.getIn(['date', 'orientation']);

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

export {DatePicker};
