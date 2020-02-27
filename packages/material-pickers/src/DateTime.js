import React from "react";
import {DateTimePicker as MuiDateTimePicker, KeyboardDateTimePicker,} from '@material-ui/pickers';
import {addAdditionalProps} from "./TimeBase";
import {DateTimeBase} from "./DateTimeBase";

const KeyboardButtonProps = {
    'aria-label': 'change date time',
};

const DateTimePicker = ({
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
    additionalProps = addAdditionalProps(additionalProps, schema);

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

export {DateTimePicker};
