import {SliderPicker} from 'react-color';
import useTheme from "@material-ui/core/styles/useTheme";
import {ColorBase} from "./Base/ColorBase";
import {ColorStaticBase} from "./Base/ColorStaticBase";
import React from "react";

const ColorSlider = (props) => {
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

const ColorSliderStatic = (props) => {
    const {palette, spacing} = useTheme();
    const styles = {
        'default': {
            wrap: {
                background: palette.background.paper,
                boxShadow: 0,
                width: '100%',
                padding: spacing(1) + 'px 0 0 0'
            },
        }
    };
    return <ColorStaticBase {...props} ColorPicker={SliderPicker} styles={styles}/>
};

export {ColorSlider,ColorSliderStatic}
