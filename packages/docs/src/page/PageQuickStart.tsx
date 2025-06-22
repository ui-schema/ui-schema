import React from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'
import Paper from '@mui/material/Paper'
import { Markdown } from '../component/Markdown'
import DemoUIGenerator from '../component/Schema/DemoUIGenerator'
import { RichCodeEditor } from '../component/RichCodeEditor'
import { useHistory } from 'react-router-dom'
import { LinkableHeadlineMenu, useHeadlines } from '@control-ui/docs/LinkableHeadline'
import { HeadMeta } from '@control-ui/kit/HeadMeta'
import { PageContent } from '@control-ui/kit/PageContent'
import { LoadingCircular } from '@control-ui/kit/Loading'

const demoSchema = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            minLength: 3,
        },
        comment: {
            type: 'string',
            widget: 'Text',
            view: {
                rows: 3,
            },
        },
        accept_privacy: {
            type: 'boolean',
        },
    },
    required: ['accept_privacy'],
}

const PageQuickStart = () => {
    const history = useHistory()
    const [, setHeadlines] = useHeadlines()

    const urlParams = new URLSearchParams(window.location.search)
    const [render, setInternalRender] = React.useState(urlParams.get('render') === 'custom' ? 'custom' : 'automatic')
    const [ds, setInternalDS] = React.useState(urlParams.get('ds') === 'bts' ? 'bts' : 'mui')

    const setDS = (nextDs: string) => {
        history.push(history.location.pathname + '?ds=' + nextDs + '&render=' + render)
        setInternalDS(nextDs)
    }
    const setRender = (nextRender: string) => {
        history.push(history.location.pathname + '?ds=' + ds + '&render=' + nextRender)
        setInternalRender(nextRender)
    }

    const hash = history.location.hash
    React.useEffect(() => {
        if (hash) {
            const target = document.querySelector(hash)
            if (target) {
                target.scrollIntoView()
            }
        }
    }, [hash])

    React.useEffect(() => {
        // todo: add the custom sorter as option to `LinkableHeadlineMenu`
        setHeadlines(h => {
            h = [...h]
            h = h.sort(
                (a, b) => {
                    return a?.level === 1 ? -1 :
                        isNaN(Number(a?.children?.[0]?.[0])) ? 1 :
                            isNaN(Number(b?.children?.[0]?.[0])) ? -1 :
                                Number(a?.children?.[0]?.[0]) < Number(b?.children?.[0]?.[0]) ? -1 : 1
                },
            )
            return h
        })
    }, [render, setHeadlines])

    return <>
        <HeadMeta
            title={'UI-Schema Quick Start - get automatic forms with JSON-Schema!'}
            description={'In 6 steps to a React form that sends data to an API! Generate forms with JSON-Schema and Material-UI or Bootstrap'}
        />
        <PageContent maxWidth={'md'}>
            <Paper style={{margin: '12px 0', padding: 24, display: 'flex', flexDirection: 'column', overflowX: 'auto', borderRadius: 5}} variant={'outlined'}>
                <Markdown source={`
# Quick-Start UI-Schema

Quickly build a contact form that sends data to an API - if the user entered it correctly   .

UI-Schema works with JSON-Schema and any design-system, each included design-system exports a widget binding for the UI renderer.

See the [**list of widgets**](/docs/overview#widget-list) for the different design-system support.
`}/>

                <Markdown source={`
**Automatic vs. Custom UI**, UI Schema supports either:

- full automatic UI generation by JSON-Schema and data, *or:*
- custom UI with autowired and always validated widgets / partial-automatic rendering

`}/>
                <Box>
                    <ToggleButtonGroup
                        value={render}
                        exclusive
                        onChange={(_, value) => setRender(value)}
                        aria-label="rendering mode"
                        size={'large'}
                        color={'secondary'}
                        fullWidth
                    >
                        <ToggleButton value="automatic" aria-label="automatic rendering">
                            {'Automatic'}
                        </ToggleButton>
                        <ToggleButton value="custom" aria-label="custom rendering">
                            {'Custom'}
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                <LinkableHeadlineMenu initial disableNavLink onClickKeepOpen/>
            </Paper>

            <Paper style={{margin: '12px 0', padding: 24, display: 'flex', flexDirection: 'column', overflowX: 'auto', borderRadius: 5}} variant={'outlined'}>
                <Markdown source={`
## 1. Install

First select the design-system and install ui-schema and dependencies.
`}/>

                <Box mb={4}>
                    <ToggleButtonGroup
                        value={ds}
                        exclusive
                        onChange={(_, value) => setDS(value)}
                        aria-label="rendering mode"
                        size={'large'}
                        color={'secondary'}
                        fullWidth
                    >
                        <ToggleButton value="mui">
                            {'MUI'}
                        </ToggleButton>
                        <ToggleButton value="bts">
                            {'Bootstrap'}
                        </ToggleButton>
                        <ToggleButton value="custom" aria-label="custom design system">
                            {'Custom'}
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                {ds === 'mui' ? <Markdown source={`
\`\`\`bash
npm i --save @ui-schema/ui-schema immutable \\
    @ui-schema/ds-material \\
    @mui/material @mui/icons-material
\`\`\`

> for version constraints [check the ds-material/package.json](https://github.com/ui-schema/ui-schema/blob/master/packages/ds-material/package.json)

> first time with MUI? [head to the mui.com quick start](https://mui.com/material-ui/getting-started/installation/)
>
> - \`<= ds-material@v0.3.x\` supports \`@material-ui/core\` (v4)
> - \`>= ds-material@v0.4.x\` supports \`@mui/material\` (v5)

> More the demo person?
>
> - [simple create-react-app demo](https://github.com/ui-schema/demo-cra) with a [codesandbox](https://codesandbox.io/s/github/ui-schema/demo-cra/tree/master/?autoresize=1&fontsize=12&hidenavigation=1&module=%2Fsrc%2FSchema%2FDemoEditor.js)
> - [complexer examples using TypeScript and create-react-app](https://github.com/ui-schema/demo-cra-ts) with a [codesandbox](https://codesandbox.io/s/github/ui-schema/demo-cra-ts/tree/master/?autoresize=1&fontsize=12&hidenavigation=1&module=%2Fsrc%2Fpages%2FPageSimpleForm.tsx)
`}/> : null}
                {ds === 'bts' ? <Markdown source={`
> no priority currently for bootstrap widgets development, but happy about PRs
\`\`\`bash
npm i --save @ui-schema/ui-schema immutable \\
    @ui-schema/ds-bootstrap bootstrap
\`\`\`
`}/> : null}
                {ds === 'custom' ? <Markdown source={`
Install dependencies then head to the [widgets binding documentation](/docs/widgets#create-design-system-binding) for more about creating design systems bindings.

\`\`\`bash
npm i --save @ui-schema/ui-schema immutable
\`\`\`
`}/> : null}
            </Paper>

            {render === 'custom' ?
                <Paper style={{margin: '12px 0', padding: 24, display: 'flex', flexDirection: 'column', overflowX: 'auto', borderRadius: 5}} variant={'outlined'}>
                    <Markdown source={`
## 2. Create Demo Generator

Create a file which serves as demo: \`DemoGenerator.js\`

Create an empty generator component in the file with the needed imports, move the \`UIMetaProvider\` to a position, where it does not re-render on \`store\` changes, e.g. lifting it up in the react tree.
`}/>

                    <Grid container>
                        <Grid item xs={12}>
                            <Markdown source={`
\`\`\`jsx
import React from "react";

// Import UI Generator Components
import {
    isInvalid,                     // for validity checking
    createEmptyStore, createStore, // for initial data-store creation
    createMap, createOrderedMap,   // for deep immutables
    storeUpdater,                  // for on change handling
    PluginStack, applyWidgetEngine, // for creating custom positioned widgets
    ObjectGroup,                   // for handling schema level "type-object"
} from "@ui-schema/ui-schema";

// Simple translator for in-schema translation, keyword \`t\`
import { relTranslator } from '@ui-schema/ui-schema/Translate/relT'

// use one \`UIMetaProvider\` for many \`UIStoreProvider\`
import { UIStoreProvider } from '@ui-schema/ui-schema/UIStore';
import { UIMetaProvider } from '@ui-schema/ui-schema/UIMeta';

// import the widgets for your design-system.
${ds === 'mui' ? 'import { widgets } from "@ui-schema/ds-material";' : 'import { widgets } from "@ui-schema/ds-bootstrap";'}

// Empty Demo Schema & Data/Values
const schema = createOrderedMap({});
const values = {};

export const Generator = () => {
    // here the state will be added

    return (
        // move \`UIMetaProvider\` somewhere higher in your app
        <UIMetaProvider>
            <UIStoreProvider>
                {/* here the components will be added */}
            </UIStoreProvider>
        </UIMetaProvider>
    )
};
\`\`\`
`}/>
                        </Grid>
                    </Grid>
                </Paper> : null}

            {render === 'automatic' ?
                <Paper style={{margin: '12px 0', padding: 24, display: 'flex', flexDirection: 'column', overflowX: 'auto', borderRadius: 5}} variant={'outlined'}>
                    <Markdown source={`
## 2. Create Demo Generator

Create a file which serves as demo: \`DemoGenerator.js\`

Add an empty provider in the file with the needed imports.
`}/>

                    <Grid container>
                        <Grid item xs={12}>
                            <Markdown source={`
\`\`\`jsx
import React from "react";

// "global" ui-config
import { UIMetaProvider, useUIMeta } from '@ui-schema/ui-schema/UIMeta';
// for data-stores / data-binding
import { UIStoreProvider, createEmptyStore, createStore } from '@ui-schema/ui-schema/UIStore';
import { storeUpdater } from '@ui-schema/ui-schema/storeUpdater';

// util for \`PluginStack\` rendering
import { injectWidgetEngine } from '@ui-schema/ui-schema/applyWidgetEngine';

// for validity checking
import { isInvalid } from '@ui-schema/ui-schema/ValidityReporter';
// for deep immutables
import { createOrderedMap } from '@ui-schema/ui-schema/createMap';
// for \`t\` keyword support / basic in-schema translation
import { relTranslator } from '@ui-schema/ui-schema/Translate/relT';

// import the widgets for your design-system.
${ds === 'mui' ? 'import { widgets } from "@ui-schema/ds-material";' : 'import { widgets } from "@ui-schema/ds-bootstrap";'}

// root-level grid container
${ds === 'mui' ? 'import { GridContainer } from "@ui-schema/ds-material/GridContainer";' : 'import { GridContainer } from "@ui-schema/ds-bootstrap/GridContainer";'}

// Empty Demo Schema & Data/Values
const schema = createOrderedMap({});
const values = {};

export const Generator = () => {
    // here the state will be added

    return (
        // move \`UIMetaProvider\` somewhere higher in your app, use one meta provider for multiple store providers
        <UIMetaProvider>
            <UIStoreProvider>
                {/* here the ui-engine components will be added */}
            </UIStoreProvider>
        </UIMetaProvider>
    )
};
\`\`\`
`}/>
                        </Grid>
                    </Grid>
                </Paper> : null}

            <Paper style={{margin: '12px 0', padding: 24, display: 'flex', flexDirection: 'column', overflowX: 'auto', borderRadius: 5}} variant={'outlined'}>
                <Markdown source={`
## 3. Create Store State, Add Schema

Each \`UIStoreProvider\` needs to receive a \`store\` and \`onChange\` to work with the data and have something to save validity and internal values. The store must be an \`UIStore\`, which is based on a [immutable](https://immutable-js.github.io/immutable-js/) Record.

With \`PluginStack\` (and related utils) components can be wired up with the render engine, for improved performance in big editors.

The schema in this example is bundled with the component and not dynamic, the schema must be an \`immutable\`. A minimal valid schema is an empty \`object\` schema.
`}/>

                <Grid container>
                    <Grid item xs={12}>
                        <Markdown source={`
\`\`\`jsx
// Minimal Schema, transformed from JS-Object into deep immutable
const schema = createOrderedMap({
    type: 'object',
});

const values = {};
${render === 'automatic' ? `
// wire up the grid container component with the render engine:
const GridStack = injectWidgetEngine(GridContainer)
` : ''}
export const Generator = () => {
    // Create a state with the data, transforming into immutable on first mount
    const [store, setStore] = React.useState(() => createStore(createOrderedMap(values)));

    // or create empty store, based on the schema type:
    // const [store, setStore] = React.useState(() => createEmptyStore(schema.get('type'));

    const onChange = React.useCallback((actions) => {
        setStore(storeUpdater(actions))
    }, [setStore])

    return (
        // move \`UIMetaProvider\` somewhere higher in your app
        <UIMetaProvider
            widgets={widgets}
            t={relTranslator}
        >
            <UIStoreProvider
                store={store}
                onChange={onChange}
                showValidity={true}
            >
                ${render === 'automatic' ? '<GridStack isRoot schema={schema}/>' : '{/* ... */}'}
            </UIStoreProvider>
        </UIMetaProvider>
    )
};
\`\`\`
`}/>
                    </Grid>
                </Grid>
            </Paper>

            <Paper style={{margin: '12px 0', padding: 24, display: 'flex', flexDirection: 'column', overflowX: 'auto', borderRadius: 5}} variant={'outlined'}>
                <Grid container>
                    <Grid item xs={12}>
                        <Markdown source={`
## 4. Add First Inputs

Each \`object\` can have multiple \`properties\`, each can be of a different type, we define now a single-line text, multi-line text and boolean property to our contact schema.

Properties defined in \`required\` must be filled out, see what is [invalid for required](/docs/schema#required-keyword).

See [schema docs](/docs/schema) for the keywords of each type.
`}/>
                    </Grid>
                    <Grid item xs={12}>
                        <Markdown source={`
\`\`\`jsx
const schema = createOrderedMap(${JSON.stringify(demoSchema, null, 2)});
\`\`\`
`}/>
                    </Grid>
                </Grid>
                {render === 'automatic' ? <>
                    <Grid item xs={12}>
                        <Markdown source={`
---

> Your editor should look like this when using **ds-material**:
`}/>
                    </Grid>
                    <Grid item xs={12} md={9} style={{margin: '0 auto'}}>
                        <DemoUIGenerator activeSchema={demoSchema} id={'qs-demo'}/>
                    </Grid>
                </> : null}
            </Paper>
            {render === 'automatic' ?
                <Paper style={{margin: '12px 0', padding: 24, display: 'flex', flexDirection: 'column', overflowX: 'auto', borderRadius: 5}} variant={'outlined'}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Markdown source={`
## 5. Add API Call

Now we add a button that will send the store of the editor to an API if the form is valid.

We tell the editor also to display validity from start on.
`}/>
                        </Grid>
                        <Grid item xs={12}>
                            <Markdown source={`
\`\`\`jsx
const GridStack = injectWidgetEngine(GridContainer)

export const Generator = () => {
    const [store, setStore] = React.useState(() => createStore(createOrderedMap(values)));

    const onChange = React.useCallback((actions) => {
        setStore(storeUpdater(actions))
    }, [setStore])

    return (
        <React.Fragment>
            <UIMetaProvider
                widgets={widgets}
                t={relTranslator}
            >
                <UIStoreProvider
                    store={store}
                    onChange={onChange}
                    showValidity={true}
                >
                    <GridStack isRoot schema={schema}/>
                </UIStoreProvider>
            </UIMetaProvider>

            {/* add your sending button, in the onClick check for validity and do the needed action */}
            <button
                disabled={!!isInvalid(store.getValidity())}
                onClick={() => {
                    if(!isInvalid(store.getValidity())) {
                        // when not invalid, post to an API
                        fetch('https://httpbin.org/post', {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            // here the immutable store is converted back to JS-Object and then to JSON
                            body: JSON.stringify(store.valuesToJS())
                        })
                            .then(r => r.json())
                            .then(answer => console.log(answer))
                            .catch(err => console.error(err))
                    }
                }}
            >Send</button>
        </React.Fragment>
    )
};
\`\`\`
`}/>
                        </Grid>

                        <Grid item xs={12}>
                            <Markdown source={`
Test the demo form below, it will send the entered data to [httpbin.org*](https://httpbin.org) with \`POST\` and display the response after the form.
`}/>
                        </Grid>

                        <Grid item xs={12} md={9} style={{margin: '24px auto 0 auto'}}>
                            <QuickStartEditor/>
                        </Grid>

                        <Grid item xs={12} style={{marginTop: 16}}>
                            <Markdown source={`
### Next Steps

- [JSON-Schema Guides](https://json-schema.org/understanding-json-schema/)
- [Adding translations](/docs/localization)
- [Creating widgets](/docs/widgets#creating-widgets)
- [Adding / Overwriting Widgets](/docs/widgets#adding--overwriting-widgets)
- [More about PluginStack for nesting in arrays/objects](/docs/core-pluginstack)
`}/>
                        </Grid>
                    </Grid>
                </Paper> : null}

            {render === 'custom' ? <>
                <Paper style={{margin: '12px 0', padding: 24, display: 'flex', flexDirection: 'column', overflowX: 'auto', borderRadius: 5}} variant={'outlined'}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Markdown source={`
## 5. Add Root Level Renderer

Now we add the root level renderer, the \`CustomGroup\` is responsible to validate the root schema-level.

It is recommended to nest \`type=object\` schemas for best and easiest conditional and referencing handling, otherwise checkout [ObjectGroup](/docs/core-renderer#objectgroup).
`}/>
                        </Grid>
                        <Grid item xs={12}>
                            <Markdown source={`
\`\`\`jsx
import {StringRenderer} from '@ui-schema/${ds === 'mui' ? 'ds-material' : 'ds-bootstrap'}/Widgets/TextField'

// using applyWidgetEngine, this widget is fully typed
// with the actual props of the widget component StringRenderer
const WidgetTextField = applyWidgetEngine(StringRenderer)

// custom group component, needed to also validate the root level
// this one works for objects
let CustomGroup: React.ComponentType<WidgetProps> = (props) => {
    const {
        schema: schemaLevel, storeKeys,
        // errors for the root (current) schema level
        errors, valid,
    } = props

    return <Grid container dir={'columns'} spacing={4}>
        <WidgetTextField
            storeKeys={storeKeys.push('name')}
            schema={schemaLevel.getIn(['properties', 'name'])}
            parentSchema={schemaLevel}

            // this property comes from StringRenderer:
            multiline={false}
        />

        <PluginStack
            storeKeys={storeKeys.push('comment') as StoreKeys}
            schema={schemaLevel.getIn(['properties', 'comment']) as unknown as UISchemaMap}
            parentSchema={schemaLevel}
        />

        <PluginStack
            storeKeys={storeKeys.push('accept_privacy') as StoreKeys}
            schema={schemaLevel.getIn(['properties', 'accept_privacy']) as unknown as UISchemaMap}
            parentSchema={schemaLevel}
        />
    </Grid>
}
// wiring this component
CustomGroup = applyWidgetEngine(CustomGroup)

export const Generator = () => {
    const [store, setStore] = React.useState(() => createStore(createOrderedMap(values)));

    const onChange = React.useCallback((actions) => {
        setStore(storeUpdater(actions))
    }, [setStore])

    return (
        // move \`UIMetaProvider\` somewhere higher in your app
        <UIMetaProvider
            widgets={widgets}
            t={relTranslator}
        >
            <UIStoreProvider
                store={store}
                onChange={onChange}
                showValidity={true}
            >
                {/*
                  * this could be in any component below UIStoreProvider,
                  * you can nest it in own HTML, which can be in PureComponents:
                  * using memo, they don't re-render even when store has changed
                  */}
                <CustomGroup
                    isRoot
                    schema={schema}
                />
            </UIStoreProvider>
        </UIMetaProvider>
    )
};
\`\`\`
`}/>
                        </Grid>
                    </Grid>
                </Paper>

                <Paper style={{margin: '12px 0', padding: 24, display: 'flex', flexDirection: 'column', overflowX: 'auto', borderRadius: 5}} variant={'outlined'}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Markdown source={`
## 6. Add API Call

Now we add a button that will send the store of the editor to an API if the form is valid.
`}/>
                        </Grid>
                        <Grid item xs={12}>
                            <Markdown source={`
\`\`\`jsx
export const Generator = () => {
    // ... the previous content ....

    return (
        <React.Fragment>
            {/* ..the generator component.. */}

            {/* add your sending button, in the onClick check for validity and do the needed action */}
            <button
                disabled={!!isInvalid(store.getValidity())}
                onClick={() => {
                    if(!isInvalid(store.getValidity())) {
                        // when not invalid, post to an API
                        fetch('https://httpbin.org/post', {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            // here the immutable store is converted back to JS-Object and then to JSON
                            body: JSON.stringify(store.valuesToJS())
                        })
                            .then(r => r.json())
                            .then(answer => console.log(answer))
                            .catch(err => console.error(err))
                    }
                }}
            >Send</button>
        </React.Fragment>
    )
};
\`\`\`
`}/>
                        </Grid>

                        <Grid item xs={12}>
                            <Markdown source={`
Test the demo form below, it will send the entered data to [httpbin.org*](https://httpbin.org) with \`POST\` and display the response after the form.
`}/>
                        </Grid>

                        <Grid item xs={12} md={9} style={{margin: '24px auto 0 auto'}}>
                            <QuickStartEditor/>
                        </Grid>

                        <Grid item xs={12} style={{marginTop: 16}}>
                            <Markdown source={`
### Next Steps

- [JSON-Schema Guides](https://json-schema.org/understanding-json-schema/)
- [Adding custom l10n](/docs/localization)
- [Creating widgets](/docs/widgets#creating-widgets)
- [Adding / Overwriting Widgets](/docs/widgets#adding--overwriting-widgets)
- [More about PluginStack for nesting in arrays/objects](/docs/core-pluginstack)
`}/>
                        </Grid>
                    </Grid>
                </Paper>
            </> : null}
        </PageContent>
    </>
}

const QuickStartEditor = () => {
    const [sending, setSending] = React.useState<number | boolean | object | string>(0)

    return <React.Fragment>
        <DemoUIGenerator
            activeSchema={demoSchema}
            id={'qs-demo-send'}
            onClick={(store) => {
                setSending(true)
                fetch('https://httpbin.org/post', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(store.valuesToJS()),
                })
                    .then(r => r.json())
                    .then(setSending)
                    .catch(() => setSending(false))
            }}
            showDebugger={false}
        />

        <Box style={{marginTop: 12}}>
            {sending === true ?
                <LoadingCircular title={'Sending'}/>
                : null}

            {sending === false ?
                <LoadingCircular title={'Error Sending'}/>
                : null}

            {typeof sending === 'object' ?
                <Typography component={'p'} variant={'body1'} gutterBottom>Answer from httpbin:</Typography>
                : null}

            {typeof sending === 'object' ?
                <RichCodeEditor minLines={3} maxLines={30} mode={'json'} value={typeof sending === 'string' ? sending : JSON.stringify({...sending}, null, 2)}/>
                : null}
        </Box>
    </React.Fragment>
}

export default PageQuickStart
