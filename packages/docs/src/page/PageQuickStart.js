import React from 'react';
import {Typography, Box, Grid, Button, Paper} from '@material-ui/core';
import {Markdown} from '../component/Markdown';
import DemoUIGenerator from '../component/Schema/DemoUIGenerator';
import {RichCodeEditor} from '../component/RichCodeEditor';
import {useHistory} from 'react-router-dom';
import {HeadlineMenu} from '@control-ui/docs/LinkableHeadline';
import {Head} from '@control-ui/kit/Head';
import {PageBox, PageContent} from '@control-ui/kit/PageContent';
import {LoadingCircular} from '@control-ui/kit/Loading/LoadingCircular';

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
};

const PageQuickStart = () => {
    const history = useHistory();
    const urlParams = new URLSearchParams(window.location.search);
    const [render, setRender] = React.useState(urlParams.get('render') === 'custom' ? 'custom' : 'automatic');
    const [ds, setDS] = React.useState('mui');

    const hash = history.location.hash;
    React.useEffect(() => {
        if(hash) {
            const target = document.querySelector(hash);
            if(target) {
                target.scrollIntoView();
            }
        }
    }, [hash]);

    return <>
        <Head
            title={'Quick-Start UI-Schema'}
            description={'In 6 steps to a React form that sends data to an API! Build with JSON-Schema and Material-UI or Bootstrap'}
        />
        <PageContent maxWidth={'md'}>
            <PageBox style={{margin: 12, padding: 24, display: 'flex', flexDirection: 'column', overflowX: 'auto'}}>
                <Markdown content source={`
# Quick-Start UI-Schema

Quickly build a contact form that sends data to an API - if the user entered it correctly - and get to know how UI-Schema works.

UI-Schema works with JSON-Schema and any design-system, each included design-system exports a widget binding for the UI renderer.

See the [**list of widgets**](/docs/overview#widget-list) for the different design-system support.
`}/>

                <Markdown content source={`
**UIGenerator vs. Custom UI**, UI-Schema supports either:

- full automatic UI generation by schema and data, or:
- custom UI with autowired and always validated widgets and partial-automatic generation

`}/>

                <Grid container>
                    <Grid item xs={6} style={{paddingRight: 6}}>
                        <Button fullWidth variant={render === 'automatic' ? 'contained' : 'outlined'} color={'secondary'} onClick={() => setRender('automatic')}>Automatic</Button>
                    </Grid>
                    <Grid item xs={6} style={{paddingLeft: 6}}>
                        <Button fullWidth variant={render === 'custom' ? 'contained' : 'outlined'} color={'secondary'} onClick={() => setRender('custom')}>Custom</Button>
                    </Grid>
                </Grid>

                <HeadlineMenu initial disableNavLink/>
            </PageBox>

            <Paper style={{margin: '12px 0', padding: 24, display: 'flex', flexDirection: 'column', overflowX: 'auto'}} elevation={4}>
                <Markdown content source={`
## 1. Install

First select the design-system and install ui-schema and dependencies.
`}/>

                <Grid container>
                    <Grid item xs={6} style={{paddingRight: 6}}>
                        <Button fullWidth variant={ds === 'mui' ? 'contained' : 'outlined'} color={'secondary'} onClick={() => setDS('mui')}>Material-UI</Button>
                    </Grid>
                    <Grid item xs={6} style={{paddingLeft: 6}}>
                        <Button fullWidth variant={ds === 'bts' ? 'contained' : 'outlined'} color={'secondary'} onClick={() => setDS('bts')}>Bootstrap</Button>
                    </Grid>
                    <Grid item xs={12} style={{marginTop: 24}}>
                        {ds === 'mui' ? <Markdown content source={`
\`\`\`bash
npm i --save @ui-schema/ui-schema immutable @ui-schema/ds-material @material-ui/core @material-ui/icons
\`\`\`

> for version constraints [check the ds-material/package.json](https://github.com/ui-schema/ui-schema/blob/master/packages/ds-material/package.json)

> there's also a [create-react-app demo](https://github.com/ui-schema/demo-cra)
`}/> :
                            ds === 'bts' ? <Markdown content source={`
> no priority currently for bootstrap widgets development
\`\`\`bash
npm i --save @ui-schema/ui-schema immutable @ui-schema/ds-bootstrap bootstrap
\`\`\`
`}/> :
                                'unsupported'
                        }
                    </Grid>
                </Grid>
            </Paper>

            {render === 'custom' ?
                <Paper style={{margin: '12px 0', padding: 24, display: 'flex', flexDirection: 'column', overflowX: 'auto'}} elevation={4}>
                    <Markdown content source={`
## 2. Create Demo Generator

Create a file which serves as demo: \`DemoGenerator.js\`

Create an empty generator component in the file with the needed imports, move the \`UIMetaProvider\` to a position, where it does not re-render on \`store\` changes, e.g. lifting it up in the react tree.
`}/>

                    <Grid container>
                        <Grid item xs={12}>
                            <Markdown content source={`
\`\`\`jsx
import React from "react";

// Import UI Generator Components
import {
    isInvalid,                     // for validity checking
    createEmptyStore, createStore, // for initial data-store creation
    createMap, createOrderedMap,   // for deep immutables
    storeUpdater,                  // for on change handling
    PluginStack, applyPluginStack, // for creating custom positioned widgets
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
                <Paper style={{margin: '12px 0', padding: 24, display: 'flex', flexDirection: 'column', overflowX: 'auto'}} elevation={4}>
                    <Markdown content source={`
## 2. Create Demo Generator

Create a file which serves as demo: \`DemoGenerator.js\`

Add a empty provider in the file with the needed imports.
`}/>

                    <Grid container>
                        <Grid item xs={12}>
                            <Markdown content source={`
\`\`\`jsx
import React from "react";

// Import UI Generator
import {
    UIGenerator,                   // main component
    isInvalid,                     // for validity checking
    createEmptyStore, createStore, // for initial data-store creation
    createMap, createOrderedMap,   // for deep immutables
    storeUpdater,                  // for on change handling
} from "@ui-schema/ui-schema";


// individual components, e.g. use one \`UIMetaProvider\` for many \`UIStoreProvider\` instead of \`UIGenerator\`
import { UIStoreProvider } from '@ui-schema/ui-schema/UIStore';
import { UIMetaProvider } from '@ui-schema/ui-schema/UIMeta';
// instead of \`UIGenerator\` use \`UIRootRenderer\` and pass down the schema
import { UIRootRenderer } from '@ui-schema/ui-schema/UIRootRenderer';

// Simple translator for in-schema translation, keyword \`t\`
import { relTranslator } from '@ui-schema/ui-schema/Translate/relT'

// import the widgets for your design-system.
${ds === 'mui' ? 'import { widgets } from "@ui-schema/ds-material";' : 'import { widgets } from "@ui-schema/ds-bootstrap";'}

// Empty Demo Schema & Data/Values
const schema = createOrderedMap({});
const values = {};

export const Generator = () => {
    // here the state will be added

    return (
        <UIGenerator
            /* here the props will be added */
        />
    )
};
\`\`\`
`}/>
                        </Grid>
                    </Grid>
                </Paper> : null}

            <Paper style={{margin: '12px 0', padding: 24, display: 'flex', flexDirection: 'column', overflowX: 'auto'}} elevation={4}>
                <Markdown content source={`
## 3. Create Store State, Add Schema

Each ${render === 'automatic' ? 'UIGenerator' : 'UIStoreProvider'} needs to receive a \`store\` and \`onChange\` to work with the data and have something to save validity and internal values. The store must be an \`UIStore\`, which is based on a [immutable](https://immutable-js.github.io/immutable-js/) Record.

The schema in this example is bundled with the component and not dynamic, also the schema must be immutable. A minimal valid schema is an empty \`object\` schema.
`}/>

                <Grid container>
                    <Grid item xs={12}>
                        <Markdown content source={`
\`\`\`jsx
// Minimal Schema, transformed from JS-Object into deep immutable
const schema = createOrderedMap({
    type: 'object',
});

const values = {};

export const Generator = () => {
    // Create a state with the data, transforming into immutable on first mount
    const [store, setStore] = React.useState(() => createStore(createOrderedMap(values)));

    // or create empty store, based on the schema type:
    // const [store, setStore] = React.useState(() => createEmptyStore(schema.get('type'));

    const onChange = React.useCallback((storeKeys, scopes, action) => {
        setStore(storeUpdater(storeKeys, scopes, action))
    }, [setStore])

    return (
        ${render === 'automatic' ? `<UIGenerator
            schema={schema}

            store={store}
            onChange={onChange}
            showValidity={true}

            widgets={widgets}
            t={relTranslator}
        />` : ''} ${render === 'custom' ? `<UIMetaProvider
            widgets={widgets}
            t={relTranslator}
        >
            <UIStoreProvider
                store={store}
                onChange={onChange}
                showValidity={true}
            >

            </UIStoreProvider>
        </UIMetaProvider>` : ''}
    )
};
\`\`\`
`}/>
                    </Grid>
                </Grid>
            </Paper>

            <Paper style={{margin: '12px 0', padding: 24, display: 'flex', flexDirection: 'column', overflowX: 'auto'}} elevation={4}>
                <Grid container>
                    <Grid item xs={12}>
                        <Markdown content source={`
## 4. Add First Inputs

Each \`object\` can have multiple \`properties\`, each can be of a different type, we define now a single-line text, multi-line text and boolean property to our contact schema.

Properties defined in \`required\` must be filled out, see what is [invalid for required](/docs/schema#required-keyword).

See [schema docs](/docs/schema) for the keywords of each type.
`}/>
                    </Grid>
                    <Grid item xs={12}>
                        <Markdown content source={`
\`\`\`jsx
const schema = createOrderedMap(${JSON.stringify(demoSchema, null, 2)});
\`\`\`
`}/>
                    </Grid>
                </Grid>
                {render === 'automatic' ? <>
                    <Grid item xs={12}>
                        <Markdown content source={`
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
                <Paper style={{margin: '12px 0', padding: 24, display: 'flex', flexDirection: 'column', overflowX: 'auto'}} elevation={4}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Markdown content source={`
## 5. Add API Call

Now we add a button that will send the store of the editor to an API if the form is valid.

We tell the editor also to display validity from start on.
`}/>
                        </Grid>
                        <Grid item xs={12}>
                            <Markdown content source={`
\`\`\`jsx
export const Generator = () => {
    const [store, setStore] = React.useState(() => createStore(createOrderedMap(values)));

    const onChange = React.useCallback((storeKeys, scopes, action) => {
        setStore(storeUpdater(storeKeys, scopes, action))
    }, [setStore])

    return (
        <React.Fragment>
            <UIGenerator
                schema={schema}

                store={store}
                onChange={onChange}

                widgets={widgets}

                showValidity={true}
            />
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
                            <Markdown content source={`
Test the demo form below, it will send the entered data to [httpbin.org*](https://httpbin.org) with \`POST\` and display the response after the form.
`}/>
                        </Grid>

                        <Grid item xs={12} md={9} style={{margin: '24px auto 0 auto'}}>
                            <QuickStartEditor/>
                        </Grid>

                        <Grid item xs={12} style={{marginTop: 16}}>
                            <Markdown content source={`
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
                <Paper style={{margin: '12px 0', padding: 24, display: 'flex', flexDirection: 'column', overflowX: 'auto'}} elevation={4}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Markdown content source={`
## 5. Add Root Level Renderer

Now we add the root level render, the \`CustomGroup\` is responsible to validate the root schema-level.

It is recommended to nest \`type=object\` schemas for best and easiest conditional and referencing handling, otherwise checkout [ObjectGroup](/docs/core-renderer#objectgroup).
`}/>
                        </Grid>
                        <Grid item xs={12}>
                            <Markdown content source={`
\`\`\`jsx
import {StringRenderer} from '@ui-schema/${ds === 'mui' ? 'ds-material' : 'ds-bootstrap'}/Widgets/TextField'

// using applyPluginStack, this widget is fully typed
// with the actual props of the widget component StringRenderer
const WidgetTextField = applyPluginStack(StringRenderer)

// custom group component, needed to also validate the root level
// this one works for objects
let CustomGroup: React.ComponentType<WidgetProps> = (props) => {
    const {
        schema: schemaLevel, storeKeys, level,
        // errors for the root (current) schema level
        errors, valid,
    } = props

    return <Grid container dir={'columns'} spacing={4}>
        <WidgetTextField
            level={level + 1}
            storeKeys={storeKeys.push('name')}
            schema={schemaLevel.getIn(['properties', 'name'])}
            parentSchema={schemaLevel}

            // this property comes from StringRenderer:
            multiline={false}
        />

        <PluginStack
            level={0}
            storeKeys={storeKeys.push('comment') as StoreKeys}
            schema={schemaLevel.getIn(['properties', 'comment']) as unknown as StoreSchemaType}
            parentSchema={schemaLevel}
        />

        <PluginStack
            level={0}
            storeKeys={storeKeys.push('accept_privacy') as StoreKeys}
            schema={schemaLevel.getIn(['properties', 'accept_privacy']) as unknown as StoreSchemaType}
            parentSchema={schemaLevel}
        />
    </Grid>
}
// wiring this component
CustomGroup = applyPluginStack(CustomGroup)

// for storing at which store position a widget is,
// as it is immutable, doesn't need to be newly created in component
const rootStoreKeys = List()

export const Generator = () => {
    const [store, setStore] = React.useState(() => createStore(createOrderedMap(values)));

    const onChange = React.useCallback((storeKeys, scopes, action) => {
        setStore(storeUpdater(storeKeys, scopes, action))
    }, [setStore])

    return (
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
                    level={0}
                    storeKeys={rootStoreKeys}
                    schema={schema}
                    parentSchema={schema}
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

                <Paper style={{margin: '12px 0', padding: 24, display: 'flex', flexDirection: 'column', overflowX: 'auto'}} elevation={4}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Markdown content source={`
## 6. Add API Call

Now we add a button that will send the store of the editor to an API if the form is valid.
`}/>
                        </Grid>
                        <Grid item xs={12}>
                            <Markdown content source={`
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
                            <Markdown content source={`
Test the demo form below, it will send the entered data to [httpbin.org*](https://httpbin.org) with \`POST\` and display the response after the form.
`}/>
                        </Grid>

                        <Grid item xs={12} md={9} style={{margin: '24px auto 0 auto'}}>
                            <QuickStartEditor/>
                        </Grid>

                        <Grid item xs={12} style={{marginTop: 16}}>
                            <Markdown content source={`
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
    </>;
};

const QuickStartEditor = () => {
    const [sending, setSending] = React.useState(0);

    return <React.Fragment>
        <DemoUIGenerator
            activeSchema={demoSchema}
            id={'qs-demo-send'}
            onClick={(store) => {
                setSending(true);
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
    </React.Fragment>;
};

export default PageQuickStart
