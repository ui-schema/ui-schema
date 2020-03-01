import {restrictColors} from "./Base/restrictColors";
import {SwatchesPicker} from 'react-color';
import {ColorBase} from "./Base/ColorBase";
import React from "react";
import useTheme from "@material-ui/core/styles/useTheme";

const ColorSwatches = (props) => {
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

export {ColorSwatches}
