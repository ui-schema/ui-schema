import {restrictColors} from "../Base/restrictColors";
import {SwatchesPicker} from 'react-color';
import {ColorBase} from "../Base/ColorBase/ColorBase";
import React from "react";
import useTheme from "@mui/material/styles/useTheme";

export const ColorSwatches = (props) => {
    const {palette} = useTheme();
    const styles = {
        'default': {
            overflow: {
                background: palette.background.paper
            },
        }
    };
    const pickerProps = {};
    restrictColors(pickerProps, props.schema, true);

    return <ColorBase
        {...props} styles={styles}
        ColorPicker={SwatchesPicker}
        pickerProps={pickerProps}
    />
};
