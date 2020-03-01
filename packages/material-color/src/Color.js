import React from "react";
import {ChromePicker,} from 'react-color';
import merge from "webpack-merge";
import useTheme from "@material-ui/core/styles/useTheme";
import {ColorBase} from "./Base/ColorBase";
import {ColorDialogBase} from "./Base/ColorDialogBase";
import {ColorStaticBase} from "./Base/ColorStaticBase";

const Color = (props) => {
    const {palette} = useTheme();
    return <ColorBase {...props} ColorPicker={ChromePicker} styles={chromeStyles(palette)}/>
};

const chromeStyles = palette => ({
    'default': {
        picker: {
            background: palette.background.paper,
        },
        alpha: {
            background: '#ffffff',
        },
    }
});

const stylesDialog = palette => merge({
    'default': {
        picker: {
            boxShadow: '0',
        }
    }
}, chromeStyles(palette));

const ColorDialog = (props) => {
    const {palette} = useTheme();
    return <ColorDialogBase {...props} ColorPicker={ChromePicker} styles={stylesDialog(palette)}/>
};

const stylesStatic = palette => merge({
    'default': {
        picker: {
            boxShadow: '0',
            width: '100%',
        }
    }
}, chromeStyles(palette));

const ColorStatic = (props) => {
    const {palette,} = useTheme();
    return <ColorStaticBase {...props} ColorPicker={ChromePicker} styles={stylesStatic(palette)}/>
};

export {Color, ColorDialog, ColorStatic};
