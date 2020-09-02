import React from "react";
import {Typography, useTheme,} from "@material-ui/core";
import {RichCodeEditor, supportedModes} from "./RichCodeEditor";
import DemoEditor from "./Schema/DemoEditor";

const languageMapping = {
    js: 'javascript',
    typescript: 'typescript',
    bash: 'powershell',
    'ui-schema': 'json',
};

const Code = ({variant, ...p}) => {
    const {palette} = useTheme();

    const currentMode = languageMapping[p.language] ? languageMapping[p.language] : p.language;
    if(p.language === 'ui-schema') {
        let value = {};
        try {
            value = JSON.parse(p.value);
        } catch(e) {
            console.error(e);
        }
        return <div style={{marginTop: 24}}><DemoEditor uiStyle={{margin: 12}} activeSchema={value} id={'ui-schema'} split={false}/></div>;
    }

    if(supportedModes.indexOf(currentMode) === -1) {
        console.log('unsupported', currentMode, supportedModes)
    }

    return supportedModes.indexOf(currentMode) === -1 ?
        <Typography component={'pre'} variant={variant} style={{background: palette.divider}} gutterBottom>
            <Typography component={'code'} className={'code--' + p.language}>
                {p.value}
            </Typography>
        </Typography> :
        <RichCodeEditor
            value={p.value} readOnly mode={currentMode}
            fontSize={14} minLines={1} maxLines={30} enableShowAll
            style={{margin: '24px 0', transition: 'height 0.4s linear 0s'}}/>
};

export default Code
