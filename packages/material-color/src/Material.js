import useTheme from "@material-ui/core/styles/useTheme";
import {MaterialPicker,} from 'react-color';
import {ColorBase} from "./Base/ColorBase";
import React from "react";

const ColorMaterial = (props) => {
    const {palette} = useTheme();
    const styles = {
        'default': {material: {background: palette.background.paper, width: 160, height: 130},}
    };
    return <ColorBase {...props} ColorPicker={MaterialPicker} styles={styles}/>
};

export {ColorMaterial}
