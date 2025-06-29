import React from 'react'
import Typography, { TypographyProps } from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { RichCodeEditor, supportedModes } from './RichCodeEditor'
import DemoUIGenerator from './Schema/DemoUIGenerator'

const languageMapping = {
    js: 'javascript',
    typescript: 'typescript',
    bash: 'powershell',
    'ui-schema': 'json',
}

const Code = ({variant, className, children}: { variant?: TypographyProps['variant'], className?: string[], children: string }) => {
    const {palette} = useTheme()
    const language = className?.find(cls => cls.indexOf('language-') === 0)?.slice('language-'.length)
    const currentMode = language && languageMapping[language] ? languageMapping[language] : language
    if (language === 'ui-schema') {
        let value = {}
        try {
            value = JSON.parse(children)
        } catch (e) {
            console.error(e)
        }
        return <div style={{marginTop: 24}}><DemoUIGenerator uiStyle={{margin: 12}} activeSchema={value} id={'ui-schema'} split={false}/></div>
    }

    if (currentMode && supportedModes.indexOf(currentMode) === -1) {
        console.log('unsupported', currentMode)
    }

    return supportedModes.indexOf(currentMode) === -1 ?
        <Typography component={'pre'} variant={variant} style={{background: palette.divider}} gutterBottom>
            <Typography component={'code'} className={'code--' + language}>
                {children}
            </Typography>
        </Typography> :
        <RichCodeEditor
            value={children} readOnly mode={currentMode}
            fontSize={14} minLines={1} maxLines={30} enableShowAll
            style={{margin: '8px 0 12px 0', transition: 'height 0.4s linear 0s'}}
        />
}

export default Code
