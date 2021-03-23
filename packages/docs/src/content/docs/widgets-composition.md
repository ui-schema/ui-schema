# Widgets Composition

This page contains more in-depth docs and thoughts about the [widgets](/docs/widgets) composition concept, enabling near endless widget & pugins customization possibilities powered by `@ui-schema/ui-schema`.

## Deep Dive Concepts

Built with the ReactJS native [render flow](https://reactjs.org/docs/state-and-lifecycle.html#the-data-flows-down) and [hoisted states](https://reactjs.org/docs/lifting-state-up.html#lifting-state-up) as foundation, leaning a few principles from [`redux`](https://redux.js.org/tutorials/fundamentals/part-2-concepts-data-flow) / [`flux`](https://facebook.github.io/flux/docs/in-depth-overview), rendering [atomic conditional](https://reactjs.org/docs/conditional-rendering.html) and [pure](https://medium.com/technofunnel/working-with-react-pure-components-166ded26ae48) wrapper components around single schema levels.

A lot of [component composition](https://www.robinwieruch.de/react-component-composition) around the [`widgets` binding](/docs/widgets#create-design-system-binding) to get / specify the needed custom react components for each usage, thus nearly no HTML/output inside the core.

Custom [`React.Context` / Providers](https://reactjs.org/docs/context.html) are used for handling store updates and extracting with special [HOCs](https://reactjs.org/docs/higher-order-components.html) (connecting `store` to `props`).

Using an additional [props plugins system](/docs/plugins#validation-plugins) for a shallower component tree of validators.

## Widgets & Component Plugins

Each plugin or widget should only need to do one specific thing, in one specific schema layer, leading to [enhanced performance](https://reactjs.org/docs/optimizing-performance.html#shouldcomponentupdate-in-action) and optimizing [reconciliation levels](https://reactjs.org/docs/reconciliation.html). Forming a [typical AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree) renderer based on schema keywords and data structures - stored in a central [immutable data-structure](/docs/core#uistore).

> check also the base concepts about [performance](/docs/performance), especially keep an eye open for `non-scalar` widget infos and `memo`

The AST and plugins are rendered by [`PluginStack`](/docs/core#pluginstack) - initially started by [`UIRootRenderer`](/docs/core#uirootrenderer).

 A plugin or widget can use more than only it's own schema/store level in various ways.

-  `ObjectRenderer` uses one schema-level, to build the next level automatically, by nesting of `PluginStack`
 - if the next level can only be rendered when the `value` is known, a non-scalar widget (`array`/`object`) must use `extractValue` to extract exactly it's own store values (`value`, `internalValue`), e.g. building a table out of array tuple items schemas
 - the `UIApi`/`ReferencingNetworkHandler` components use [React hooks](https://reactjs.org/docs/hooks-intro.html) to connect to `UIApiProvider` from within the plugin component.

## Rendering Basics

See [flowchart of @ui-schema/ui-schema](/docs/core#flowchart).

## Overwriting by **Provider**

> todo

## Overwriting by **props**

> todo

## Overwriting by **keywords**

> todo


## Random Examples

Some not-so-usual examples, mostly just as demonstration - for production usage adjustments will be needed (e.g. performance, pure components).

### Free Form Editor

One root schema, but rendering the widgets fully manually in the root level, without validating the root object for this strategy, technical limitation.

```jsx
import React from 'react';
import {List, OrderedMap} from 'immutable';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import {Button} from '@material-ui/core';
import {widgets} from '@ui-schema/ds-material';
import {UIGenerator, isInvalid, createOrderedMap, createStore} from '@ui-schema/ui-schema';
import {storeUpdater} from '@ui-schema/ui-schema/UIStore/storeUpdater';
import {UIProvider} from '@ui-schema/ui-schema/UIGenerator/UIGenerator';
import {PluginStack} from '@ui-schema/ui-schema/PluginStack/PluginStack';
import {browserT} from '../t';

const freeFormSchema = createOrderedMap({
    type: 'object',
    name: {
        type: 'string',
    },
    city: {
        type: 'string',
        widget: 'Select',
        enum: ['Berlin', 'Paris', 'Zurich'],
    },
})

// must have an own `storeKeys` when not using `UIRootRenderer`
const storeKeys = List()

const FreeFormEditor = () => {
    const [showValidity, setShowValidity] = React.useState(false);
    const [store, setStore] = React.useState(() => createStore(OrderedMap()))

    const onChange = React.useCallback((storeKeys, scopes, updater, deleteOnEmpty, type) => {
        setStore(storeUpdater(storeKeys, scopes, updater, deleteOnEmpty, type))
    }, [setStore])

    return <React.Fragment>
        <UIProvider
            store={store}
            onChange={onChange}
            widgets={widgets}
            showValidity={showValidity}
            t={browserT}
            schema={freeFormSchema}
        >
            <Grid container dir={'columns'} spacing={4}>
                <PluginStack
                    showValidity={showValidity}
                    storeKeys={storeKeys.push('name')}
                    schema={freeFormSchema.get('name')}
                    parentSchema={freeFormSchema}
                    level={1}
                    readOnly={false}
                    // noGrid={false} (as grid-item is included in `PluginStack`)
                />
                <PluginStack
                    showValidity={showValidity}
                    storeKeys={storeKeys.push('city')}
                    schema={freeFormSchema.get('city')}
                    parentSchema={freeFormSchema}
                    level={1}
                    readOnly={false}
                    // noGrid={false} (as grid-item is included in `PluginStack`)
                />
            </Grid>
        </UIProvider>

        <div style={{width: '100%'}}>
            <Button onClick={() => setShowValidity(!showValidity)}>validity</Button>
            <div>
                {isInvalid(store.getValidity()) ? 'invalid' : 'valid'}
            </div>
        </div>
    </React.Fragment>
};
```
