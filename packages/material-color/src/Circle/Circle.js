import useTheme from "@mui/material/styles/useTheme";
import {restrictColors} from "../Base/restrictColors";
import {ColorBase} from "../Base/ColorBase/ColorBase";
import {CirclePicker} from 'react-color';
import React from "react";
import merge from "deepmerge";
import {ColorStaticBase} from "../Base/ColorStaticBase/ColorStaticBase";

const styles = ({palette, circleSpacing}) => ({
    'default': {
        card: {
            background: palette.background.paper,
            boxShadow: 'rgba(0, 0, 0, 0.12) 0px 2px 10px, rgba(0, 0, 0, 0.16) 0px 2px 5px',
            paddingTop: circleSpacing,
            paddingLeft: circleSpacing,
            marginLeft: 0,
            marginRight: 0,
            boxSizing: 'content-box',
            justifyContent: 'center'
        },
    }
});

export const ColorCircle = ({circleSpacing = 12, circleSize = 28, ...props}) => {
    const {palette} = useTheme();

    const pickerProps = {circleSpacing, circleSize};
    restrictColors(pickerProps, props.schema,);

    return <ColorBase
        {...props}
        ColorPicker={CirclePicker} styles={styles({palette, circleSpacing})}
        pickerProps={pickerProps}
    />
};

const stylesStatic = ({palette, circleSpacing}) => merge(styles({palette, circleSpacing}), {
    'default': {
        card: {
            boxShadow: 0,
            boxSizing: 'border-box',
        },
    }
});

export const ColorCircleStatic = ({circleSpacing = 12, circleSize = 28, ...props}) => {
    const {palette,} = useTheme();

    const pickerProps = {circleSpacing};
    restrictColors(pickerProps, props.schema,);

    return <ColorStaticBase {...props} ColorPicker={CirclePicker} styles={stylesStatic({palette, circleSpacing})} pickerProps={{width: '100%', circleSize}}/>
};
