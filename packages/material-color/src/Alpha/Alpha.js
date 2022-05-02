import useTheme from "@mui/material/styles/useTheme";
import {ColorBase} from "../Base/ColorBase/ColorBase";
import React from "react";
import {styleWrapper} from "../styleWrapper";
import { AlphaPicker } from 'react-color';

const WrappedAlphaPicker = p => {
    const theme = useTheme();
    return <div style={styleWrapper(theme)}>
        <div style={{background: '#ffffff', borderRadius: 3}}>
            <AlphaPicker {...p} width={'100%'}/>
        </div>
    </div>
};

export const ColorAlpha = (props) => {
    return <ColorBase {...props} ColorPicker={WrappedAlphaPicker}/>
};

