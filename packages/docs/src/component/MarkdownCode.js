import React from 'react';
import {Typography, useTheme} from '@material-ui/core';
import {RichCodeEditor, supportedModes} from './RichCodeEditor';
import DemoUIGenerator from './Schema/DemoUIGenerator';

const languageMapping = {
    js: 'javascript',
    typescript: 'typescript',
    bash: 'powershell',
    'ui-schema': 'json',
};

const Code = ({variant, className, ...p}) => {
    const {palette} = useTheme();
    const language = className && className.indexOf('language-') === 0 ? className.substr('language-'.length) : undefined
    const currentMode = languageMapping[language] ? languageMapping[language] : language;
    if(language === 'ui-schema') {
        let value = {};
        try {
            value = JSON.parse(p.children);
        } catch(e) {
            console.error(e);
        }
        return <div style={{marginTop: 24}}><DemoUIGenerator uiStyle={{margin: 12}} activeSchema={value} id={'ui-schema'} split={false}/></div>;
    }

    if(supportedModes.indexOf(currentMode) === -1) {
        console.log('unsupported', currentMode, supportedModes)
    }

    return supportedModes.indexOf(currentMode) === -1 ?
        <Typography component={'pre'} variant={variant} style={{background: palette.divider}} gutterBottom>
            <Typography component={'code'} className={'code--' + language}>
                {p.children}
            </Typography>
        </Typography> :
        <RichCodeEditor
            value={p.children} readOnly mode={currentMode}
            fontSize={14} minLines={1} maxLines={30} enableShowAll
            style={{margin: '24px 0', transition: 'height 0.4s linear 0s'}}/>
};

export default Code
