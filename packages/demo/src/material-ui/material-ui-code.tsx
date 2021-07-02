import React from 'react'
import { DummyRenderer } from './component/MuiMainDummy'
import { browserT } from '../t'
import AppTheme from './layout/AppTheme'
import Dashboard from './dashboard/Dashboard'
import Grid from '@material-ui/core/Grid'
import { widgets } from '@ui-schema/ds-material'
import { useDummy } from '../component/MainDummy'
import { schemaCode } from '../schemas/demoSimples'
import { WidgetCodeProvider, Code, WidgetCodeContextType } from '@ui-schema/material-code'
import 'codemirror/mode/css/css'
import 'codemirror/mode/javascript/javascript'
// @ts-ignore
import style from 'codemirror/lib/codemirror.css'
/*import themeMaterial from 'codemirror/theme/material.css';
import themeMaterial from 'codemirror/theme/3024-day.css';
import themeMaterial from 'codemirror/theme/3024-night.css';
import themeMaterial from 'codemirror/theme/base16-dark.css';
import themeMaterial from 'codemirror/theme/base16-light.css';
import themeMaterial from 'codemirror/theme/darcula.css';*/
// @ts-ignore
import themeDark from 'codemirror/theme/duotone-dark.css'
// @ts-ignore
import themeLight from 'codemirror/theme/duotone-light.css'
import useTheme from '@material-ui/core/styles/useTheme'
import { CodeSelectable } from '@ui-schema/material-code/CodeSelectable/CodeSelectable'
import { UIMetaProvider } from '@ui-schema/ui-schema'
/*import themeMaterial from 'codemirror/theme/gruvbox-dark.css';
import themeDark from 'codemirror/theme/xq-dark.css';
import themeLight from 'codemirror/theme/xq-light.css';*/

// @ts-ignore
const useStyle = (styles) => {
    React.useEffect(() => {
        styles.use()
        return () => styles.unuse()
    }, [styles])
}

const customWidgets = {...widgets}
customWidgets.custom = {
    ...widgets.custom,
    Code: Code,
    CodeSelectable,
}

const modes: WidgetCodeContextType['modes'] = {
    json: {
        name: 'javascript',
        json: true,
    },
}

const Main = ({classes = {}}) => {
    const {toggleDummy, getDummy} = useDummy()
    const {palette} = useTheme()

    useStyle(style)
    useStyle(palette.type === 'dark' ? themeDark : themeLight)

    return <WidgetCodeProvider theme={palette.type === 'dark' ? 'duotone-dark' : 'duotone-light'} modes={modes}>
        <Grid item xs={12}>
            <DummyRenderer id={'schemaCode'} open schema={schemaCode} toggleDummy={toggleDummy} getDummy={getDummy} classes={classes}/>
        </Grid>
    </WidgetCodeProvider>
}

export default function MaterialDemoCode(): React.ReactElement {
    return <AppTheme>
        <UIMetaProvider widgets={customWidgets} t={browserT}>
            <Dashboard main={Main}/>
        </UIMetaProvider>
    </AppTheme>
}
