import React from 'react'
import Grid from '@mui/material/Grid'
import { RichContent, RichContentInline } from '@ui-schema/material-slate'
import { schemaDemoSlate, schemaDemoSlateSingle } from '../schemas/demoSlate'
import { RichContentPane } from '@ui-schema/material-slate/Widgets'
import { browserT } from '../t'
import { UIMetaProvider } from '@ui-schema/react/UIMeta'
import { DummyRenderer } from './component/MuiMainDummy'
import * as WidgetsDefault from '@ui-schema/ds-material/WidgetsDefault'
import { InfoRenderer, InfoRendererProps } from '@ui-schema/ds-material/Component/InfoRenderer'

const {widgetPlugins} = WidgetsDefault.plugins()
const customWidgets = WidgetsDefault.define<{ InfoRenderer?: React.ComponentType<InfoRendererProps> }, {}>({
    InfoRenderer: InfoRenderer,
    widgetPlugins: widgetPlugins,
    types: WidgetsDefault.widgetsTypes(),
    custom: {
        ...WidgetsDefault.widgetsCustom(),
        RichContentPane: RichContentPane,
        RichContent: RichContent,
        RichContentInline: RichContentInline,
    },
})

// eslint-disable-next-line react/display-name
export default () => <>
    <UIMetaProvider widgets={customWidgets} t={browserT}>
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <DummyRenderer id={'schemaSlate'} open schema={schemaDemoSlateSingle}/>
            </Grid>
            <Grid item xs={12}>
                <DummyRenderer id={'schemaSlate'} open schema={schemaDemoSlate}/>
            </Grid>
        </Grid>
    </UIMetaProvider>
</>
