import {CompactPicker} from 'react-color';
import useTheme from "@material-ui/core/styles/useTheme";
import {ColorBase} from "./Base/ColorBase";
import React from "react";

const ColorCompact = (props) => {
    const {palette} = useTheme();
    const styles = {
        'default': {compact: {background: palette.background.paper,},}
    };
    const pickerProps = {};
    if(props.schema.getIn(['view', 'colors'])) {
        pickerProps['colors'] = props.schema.getIn(['view', 'colors']).toArray();
    }

    return <ColorBase
        {...props} styles={styles}
        ColorPicker={CompactPicker}
        pickerProps={pickerProps}
    />
};

export {ColorCompact}
