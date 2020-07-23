import {SketchPicker} from 'react-color';
import merge from "deepmerge";
import useTheme from "@material-ui/core/styles/useTheme";
import {ColorBase} from "./Base/ColorBase";
import React from "react";
import {ColorStaticBase} from "./Base/ColorStaticBase";
import {ColorDialogBase} from "./Base/ColorDialogBase";

const styles = ({palette, spacing}) => ({
    'default': {
        picker: {
            background: palette.background.paper,
            boxShadow: 'rgba(0, 0, 0, 0.12) 0px 2px 10px, rgba(0, 0, 0, 0.16) 0px 2px 5px',
            width: 300,
            padding: spacing(2)
        },
    }
});

const ColorSketch = (props) => {
    const theme = useTheme();

    const pickerProps = {};
    if(props.schema.getIn(['view', 'colors'])) {
        pickerProps['presetColors'] = props.schema.getIn(['view', 'colors']).toArray();
    }

    return <ColorBase
        {...props} styles={styles(theme)}
        ColorPicker={SketchPicker}
        pickerProps={pickerProps}
    />
};

const stylesDialog = ({palette, spacing}) => merge(styles({palette, spacing}), ({
    'default': {
        picker: {
            boxShadow: 0,
        },
    }
}));

const ColorSketchDialog = (props) => {
    const theme = useTheme();

    const pickerProps = {};
    if(props.schema.getIn(['view', 'colors'])) {
        pickerProps['presetColors'] = props.schema.getIn(['view', 'colors']).toArray();
    }

    return <ColorDialogBase
        {...props} ColorPicker={SketchPicker}
        styles={stylesDialog(theme)} pickerProps={pickerProps}
    />
};

const stylesStatic = ({palette, spacing}) => merge(styles({palette, spacing}), ({
    'default': {
        picker: {
            boxShadow: 0,
            boxSizing: 'border-box',
            width: '100%',
            // would be better for responsive sizing, but SketchPresetColors has negative margin
            // padding: 0
        },
    }
}));

const ColorSketchStatic = (props) => {
    const theme = useTheme();

    const pickerProps = {};
    if(props.schema.getIn(['view', 'colors'])) {
        pickerProps['presetColors'] = props.schema.getIn(['view', 'colors']).toArray();
    }

    return <ColorStaticBase
        {...props} ColorPicker={SketchPicker}
        styles={stylesStatic(theme)} pickerProps={pickerProps}
    />
};

export {ColorSketch, ColorSketchDialog, ColorSketchStatic}
