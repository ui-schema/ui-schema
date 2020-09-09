# UI-Schema Core

Components and functions exported by `@ui-schema/ui-schema` for usage within design systems, plugins and widgets.

The props passed to the `SchemaEditor`, `NestedSchemaEditor` are accessible through providers.

Basic [flowchart](#flowchart) of the SchemaEditor to Widget logic.

## EditorStore

Values are stored in `EditorStore`, an immutable record, created with [createStore](#createstore) or [createEmptyStore](#createemptystore):

- `EditorStore.values`:`{undefined|string|boolean|number|OrderedMap|List}`
- `EditorStore.internals`:`{Map}`
- `EditorStore.validity`:`{Map}`
- `EditorStore.valuesToJS()`:`{*}` returns the values, but as JS compatible object, turning `Map`/`List` into `{}`/`[]`
- `EditorStore.getValues()`:`{*}` returns the values
- `EditorStore.getInternals()`:`{Map}` returns the internal values
- `EditorStore.getValidity()`:`{Map}` returns the validity

Use the [updater functions](#store-updating-utils) for store changes from widgets.

For best performance in non-scalar widgets use the [HOCs](https://reactjs.org/docs/higher-order-components.html) `extractValue`, `extractValidity` for getting the values, together with [memo](#memo--isequal).

General typings of the store:

```typescript jsx
import { EditorStoreType } from '@ui-schema/ui-schema/EditorStore'
```

### EditorStoreProvider

Saves and provides the `store`, `onChange` and `schema`.

- Provider: `EditorStoreProvider`
- Hook: `useSchemaStore`
    - returns: `{store: EditorStore, onChange: function, schema: OrderedMap}`
- HOC to get the current widgets values by `storeKeys`:
    - `extractValue` passes down: `value`, `internalValue`, `onChange`
    - `extractValidity` passes down: `validity`, `onChange`
- Properties:
    - `store` : `{EditorStore}` the immutable record storing the current editor state
    - `onChange` : `{function(function): OrderedMap}` a function capable of updating the saved store
    - `schema` : `{OrderedMap}` the full schema as an immutable map

See [core functions to update store](#store-updating-utils).

Example creating the provider:

```js
import React from "react";
import {EditorStoreProvider} from "@ui-schema/ui-schema";

const CustomProvider = ({store, onChange, schema, children}) =>{
    return <EditorStoreProvider
        store={store}
        onChange={onChange}
        schema={schema}
        children={children}
    />;
}
```

Example Hook:

```js
import React from "react";
import {isInvalid, useSchemaStore} from "@ui-schema/ui-schema";
const Comp = ({storeKeys, ...props}) => {
    const {
        onChange, // also passed down in props: `props.onChange`
        store,
    } = useSchemaStore();

    store.getValidity();  // better to use the HOC `extractValidity`
    store.getInternals(); // better to use the HOC `extractValue`
    store.getValues();    // better to use the HOC `extractValue`

    let invalid = isInvalid(validity, storeKeys, false); // Map, List, boolean: <if count>
    
    return null;// e.g. widget or plugin
};
```

#### Store Updating Utils

These function must be used when updating the store, internally they work around the `store`, an instance of the `EditorStore` immutable record.

All return another function, not executing directly, this function is then executed from `onChange` - receiving the current state value, updating the `storeKeys` value with the given value in one of the records entry.

The functions are capable of either updating a deep value in the `store`, or when in e.g. root-level directly the store (e.g. `type: 'string'` as root-schema).

- use for updating values:
    - `updateValue(storeKeys, value, required?: boolean, type?: string)` to only update the normal data value
    - `updateValues(storeKeys, value, internalValue, required?: boolean, type?: string)` to update the normal data value and internal store value, should be used when the widget relies on data to work - that is not like the schema type
    - `updateInternalValue(storeKeys, internalValue)` to update only the internal store value
- update the `validity` entry:
    - `updateValidity(storeKeys, valid)`
- `cleanUp(storeKeys, key)` deletes the entry at `storeKeys` in the specified `key` scope, e.g:
    - `cleanUp(storeKeys, 'validity')` deletes validity entry
    - `cleanUp(storeKeys, 'internals')` deletes internal store entry
    - `cleanUp(storeKeys, 'values')` deletes value/data entry

```js
import {
    updateValue, updateValues, updateInternalValue,
    updateValidity,
    cleanUp
} from "@ui-schema/ui-schema";
```

See [simplest Text Widget](/docs/widgets#simplest-text-widget) for a basic widget example.
    
This can be used to delete the current storeKeys entry in the validity scope at unmount of the current widget/pluginStack:

```js
React.useEffect(() => {
    return () => cleanUp(storeKeys, 'validity') 
});
```

## EditorProvider

Saves additional functions and meta-data for the editor.

- Provider: `EditorProvider`
- Hook: `useEditor`
- HOC: `withEditor`
- Properties/ContextData:
    - `widgets` JS-object
    - `showValidity` boolean
    - `t` : `function` translator function, see [translation](/docs/localization#translation)
    
Example Hook:

```js
import React from "react";
import {useEditor} from "@ui-schema/ui-schema";
const Comp = () => {
    const {widgets} = useEditor();

    const RootRenderer = widgets.RootRenderer;
    return <RootRenderer {...props}/>
};
```

Example HOC, recommended for memo usage:

```js
import React from "react";
import {withEditor} from "@ui-schema/ui-schema";

const Comp = withEditor(
    React.memo(
        ({widgets, showValidity, t, ...props}) => {
            const RootRenderer = widgets.RootRenderer;
            return <RootRenderer {...props}/>
        }
    )
);
```
    
## Main Schema Editor

### SchemaEditor

Main entry point for every new Schema Editor, renders the RootRenderer and starts the whole schema with `SchemaEditorRenderer`. 

### NestedSchemaEditor

Automatic nesting schema-editor, uses the parent contexts, starts a SchemaEditor at schema-level with `SchemaEditorRenderer`.

It works with adding the wanted schema and it's storeKeys, this automatically enables data-binding by `SchemaEditorRenderer`.

- allows overwriting `showValidity`, `widgets`, `t` easily by attaching itself to the parent's editor provider (not store provider). 
- data/store must not be pushed through
- any property that `NestedSchemaEditor` receives is available within plugins and widgets

```js
import React from "react";
import {NestedSchemaEditor} from "@ui-schema/ui-schema";

const Box = ({schema, storeKeys, level, showValidity}) => {
    // create a simple custom Object handler for some style, but let the core handle everything
    
    // can also be that schema/storeKeys are calculated by some other values here, rendering what ever schema (and not only type: object`)
    return <div className="fancy-box">
        <NestedSchemaEditor
            showValidity={showValidity}
            storeKeys={storeKeys}
            schema={schema}
            level={level}
            noGrid // not a provider property, so pushed to the pluginStack, available for the GridHandler
        />
    </div>
};
```

### SchemaEditorProvider

Provider to position the actual editor in any position, just pass everything down to the provider, the SchemaRootRenderer connects to the provider automatically. Recommended to add memoized abstraction layers between HTML and provider.

```js
import React from "react";
import {
    SchemaEditorProvider, SchemaRootRenderer,
    isInvalid, useSchemaStore,
} from "@ui-schema/ui-schema";

const CustomFooter = ({someCustomProp}) => {
    // access the editor context, also available e.g.: useSchemaWidgets, useSchemaData
    const {store} = useSchemaStore();
    
    return <p style={{fontWeight: someCustomProp ? 'bold' : 'normal'}}>
        {isInvalid(store.getValidity()) ? 'invalid' : 'valid'}
    </p>
}

const CustomEditor = ({someCustomProp, ...props}) => (
    <SchemaEditorProvider {...props}>
        <div>
            <SchemaRootRenderer/>
            <div>
                <CustomFooter someCustomProp={someCustomProp}/>
            </div>
        </div>
    </SchemaEditorProvider>
);
```

### SchemaRootRenderer

Connects to the current context and uses the schema the first time, renders the `widgets.RootRenderer`. 

The `RootRenderer` is rendered in a memo component, starts the first rendering of a widget, this is the `children` of `RootRenderer`, done with [WidgetRenderer](#widgetRenderer).

## Widget Renderer

### WidgetRenderer

Entry point into widget and plugin rendering, uses the `props` to start the render tree of all registered plugins, with finally the actual widget.

### NextPluginRenderer

Used for plugin rendering, see: [creating plugins](/docs/plugins#creating-plugins).

Handles the switching between `FinalWidgetRenderer` and a `Plugin` (if there is still one which was not executed). 

#### NextPluginRendererMemo

Same as NextPluginRenderer, but as memoized function, used in e.g. object widgets when they are using [useSchemaStore](#editorStoreProvider), see: [creating plugins](/docs/plugins#creating-plugins).

### FinalWidgetRenderer

Finds the actual widget in the mapping by the then defined schema, renders the widget and passes down all accumulated props (e.g. everything the plugins have added).

If no widget was found, renders nothing / `null`, but the plugins may have already rendered something! (like the grid)

## Utils

### createStore

Creates the initial store out of passed in values.

```js
const [data, setStore] = React.useState(() => createStore(createOrderedMap(initialData)));
```

### createEmptyStore

Creates an empty store out of the schema type.

```js
const [data, setStore] = React.useState(() => createEmptyStore(schema.get('type')));
```

### memo / isEqual

ImmutableJS compatible `React.memo` memoization/equality checker.

```js
import React from 'react';
import {isEqual, memo} from '@ui-schema/ui-schema';

// `Comp` will only re-render when the props changes, compares immutable maps and lists correctly.
const Comp = memo(props => {
    let res = someHeavyLogic(props);
    return <div>
        Complex HTML that should only re-render when needed
        <OtherComponent {...res}/>
    </div>;
});
```

See [performance](/docs/performance) for the reasons and philosophy behind it.

### mergeSchema

Merges two schemas into each other: `ab = mergeSchema(a, b)`

Supports merging of these keywords, only does something if existing on `b`:

- `properties`, deep-merge b into a
- `required`, combining both arrays/lists
- `type`, b overwrites a
- `format`, b overwrites a
- `widget`, b overwrites a
- `enum`, b overwrites a
- `const`, b overwrites a
- `not`, b overwrites a
- `allOf`, are ignored, should be resolved by e.g. [combining handler](/docs/plugins#combininghandler)
- `if`, `then`, `else` are ignored, should be resolved by e.g. [conditional handler](/docs/plugins#conditionalhandler), also `if` that are inside `allOf`

### createMap

```js
let dataMap = createMap({});
```

### createOrderedMap

```js
let dataMap = createOrderedMap({});
```

### fromJSOrdered

Function to deep change an object into an ordered map, will change the objects properties but not the root-object.

```js
let dataMap = new OrderedMap(fromJSOrdered({}));
```

## Flowchart

[![flowchart](/Flowchart-SchemaEditor.svg)](https://ui-schema.bemit.codes/Flowchart-SchemaEditor.svg)
