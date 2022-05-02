import {SliderPicker} from 'react-color';
import useTheme from "@mui/material/styles/useTheme";
import {ColorBase} from "../Base/ColorBase/ColorBase";
import {ColorStaticBase} from "../Base/ColorStaticBase/ColorStaticBase";
import React from "react";

export const ColorSlider = (props) => {
    const {palette, spacing} = useTheme();
    const styles = {
        'default': {
            wrap: {
                background: palette.background.paper,
                boxShadow: 'rgba(0, 0, 0, 0.12) 0px 2px 10px, rgba(0, 0, 0, 0.16) 0px 2px 5px',
                width: 300,
                padding: spacing(2)
            },
        }
    };
    return <ColorBase {...props} ColorPicker={SliderPicker} styles={styles}/>
};

export const ColorSliderStatic = (props) => {
    const {palette, spacing} = useTheme();
    const styles = {
        'default': {
            wrap: {
                background: palette.background.paper,
                boxShadow: 0,
                width: '100%',
                padding: spacing(1) + ' 0 0 0'
            },
        }
    };
    return <ColorStaticBase {...props} ColorPicker={SliderPicker} styles={styles}/>
};
