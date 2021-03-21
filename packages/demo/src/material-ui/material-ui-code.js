import React from 'react';
import AppTheme from './layout/AppTheme';
import Dashboard from './dashboard/Dashboard';
import Grid from '@material-ui/core/Grid';
import {widgets} from '@ui-schema/ds-material';
import {createDummyRenderer} from './component/MuiMainDummy';
import {useDummy} from '../component/MainDummy';
import {schemaCode} from '../schemas/demoSimples';
import {WidgetCodeProvider, Code} from '@ui-schema/material-code';
import 'codemirror/mode/css/css';
import 'codemirror/mode/javascript/javascript';
import style from 'codemirror/lib/codemirror.css';
/*import themeMaterial from 'codemirror/theme/material.css';
import themeMaterial from 'codemirror/theme/3024-day.css';
import themeMaterial from 'codemirror/theme/3024-night.css';
import themeMaterial from 'codemirror/theme/base16-dark.css';
import themeMaterial from 'codemirror/theme/base16-light.css';
import themeMaterial from 'codemirror/theme/darcula.css';*/
import themeDark from 'codemirror/theme/duotone-dark.css';
import themeLight from 'codemirror/theme/duotone-light.css';
import useTheme from '@material-ui/core/styles/useTheme';
import {CodeSelectable} from '@ui-schema/material-code/CodeSelectable/CodeSelectable';
/*import themeMaterial from 'codemirror/theme/gruvbox-dark.css';
import themeDark from 'codemirror/theme/xq-dark.css';
import themeLight from 'codemirror/theme/xq-light.css';*/

const useStyle = (styles) => {
    React.useEffect(() => {
        styles.use();
        return () => styles.unuse();
    }, [styles]);
};

const customWidgets = {...widgets};
customWidgets.custom = {
    ...widgets.custom,
    Code,
    CodeSelectable,
};

const DummyRenderer = createDummyRenderer(customWidgets);

const Main = ({classes = {}}) => {
    const {toggleDummy, getDummy} = useDummy();
    const {palette} = useTheme();

    useStyle(style);
    useStyle(palette.type === 'dark' ? themeDark : themeLight);

    return <WidgetCodeProvider theme={palette.type === 'dark' ? 'duotone-dark' : 'duotone-light'}>
        <Grid item xs={12}>
            <DummyRenderer id={'schemaCode'} open schema={schemaCode} toggleDummy={toggleDummy} getDummy={getDummy} classes={classes}/>
        </Grid>
    </WidgetCodeProvider>
};

export default () => (
    <AppTheme>
        <Dashboard main={Main}/>
    </AppTheme>
)
