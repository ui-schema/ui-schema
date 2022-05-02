import useTheme from "@mui/material/styles/useTheme";
import {ColorBase} from "../Base/ColorBase/ColorBase";
import React from "react";
import {styleWrapper} from "../styleWrapper";
import {HuePicker,} from 'react-color';

const WrappedHuePicker = p => {
    const theme = useTheme();
    return <div style={styleWrapper(theme)}><HuePicker {...p}/></div>
};

export const ColorHue = (props) => {
    const styles = {
        'default': {
            picker: {width: '100%'},
        }
    };
    return <ColorBase {...props} ColorPicker={WrappedHuePicker} styles={styles}/>
};
