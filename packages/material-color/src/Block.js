import useTheme from "@material-ui/core/styles/useTheme";
import {restrictColors} from "./Base/restrictColors";
import {ColorBase} from "./Base/ColorBase";
import React from "react";
import {BlockPicker} from 'react-color';

const ColorBlock = ({hideInput = true, ...props}) => {
    const {palette, shape} = useTheme();
    const styles = {
        'default': {
            body: hideInput ? {padding: '10px 10px 0 10px'} : {},
            card: {
                background: palette.background.paper,
                marginTop: 6,
                boxShadow: 'rgba(0, 0, 0, 0.12) 0px 2px 10px, rgba(0, 0, 0, 0.16) 0px 2px 5px',
                borderRadius: shape.borderRadius,
            },
            input: {display: hideInput ? 'none' : 'block'},
        }
    };

    const pickerProps = {};
    restrictColors(pickerProps, props.schema,);

    return <ColorBase
        {...props} styles={styles}
        ColorPicker={BlockPicker}
        pickerProps={pickerProps}
    />
};

export {ColorBlock}
