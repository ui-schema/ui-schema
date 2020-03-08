# UI-Schema Core

Components and functions exported by `@ui-schema/ui-schema` for usage within design systems, plugins and widgets.

> todo: further detailed docs

## EditorStore

The props passed to the root `SchemaEditor` are accessible through providers.

### Editor Store Provider

- Provider: `EditorStoreProvider`
- Hook: `useSchemaStore`
    - returns: `{schema: Map, valueStore: *, internalStore: Map, onChange: function, validity: Map}`
- HOC to get the current widgets values
    - `extractValue` passes down: `value`, `internalValue`, `onChange`
    - `extractValidity` passes down: `validity`, `onChange`
- Properties/ContextData:
    - `store` : `{EditorStore}` the immutable Record storing the current editor state
    - `onChange` : `{function(function): OrderedMap}` a function capable of updating the saved store
    - `schema` : `{OrderedMap}` the full schema as an immutable map
- Properties/ContextData:
    - `valueStore` : `{OrderedMap|*}`
    - `internalStore` : `{OrderedMap|*}`
    - `validity` : `{Map|undefined}`
    - `showValidity` : `{boolean}`

See [core functions to update store](#store-updating-utils).

Example Create:

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
        valueStore, internalStore, // better to use the HOC `extractValue`
        validity,     // better to use the HOC `extractValidity`
    } = useSchemaStore();

    let invalid = isInvalid(validity, storeKeys, false); // Map, List, boolean: <if count>
    
    return null;// e.g. widget or plugin
};
```

#### Store Updating Utils

These function must be used when updating the store, internally they work arround the `store`, an instance of the `EditorStore` immutable record.

All return another function, not executing directly, this function is then executed from `onChange` - receiving the current state value, updating the `storeKeys` value with the given value in one of the records entry.

- `updateInternalValue(storeKeys, internalValue)`
- Function capable of either updating a deep value in the `store`, or when in e.g. root-level directly the store (string as root-schema)
    - `updateValue(storeKeys, value)` to only update the normal data value
    - `updateValues(storeKeys, value, internalValue)` to update the internal store value, which should not be published 
- Function capable of either updating a deep value in the `store`, or when in e.g. root-level directly the store (string as root-schema)
    - `updateValidity(storeKeys, valid)`
- `cleanUp(storeKeys, key)` deletes the entry at `storeKeys` in the specified `key` scope, e.g:
    - `cleanUp(storeKeys, 'validity')` deletes validity entry
    - `cleanUp(storeKeys, 'internals')` deletes internal store entry
    - `cleanUp(storeKeys, 'values')` deletes value/data entry
    
#### Simplest Text Widget

Updating a value from HTML input:

```js
import React from 'react';
import {updateValue, beautifyKey} from '@ui-schema/ui-schema';

const Widget = ({
                    value, ownKey, storeKeys, onChange,
                    required, schema,
                    errors, valid,
                    ...props
                }) => {
    return <>
        <label>{beautifyKey(ownKey)}</label>

        <input
            type={'text'}
            required={required}
            value={value || ''}
            onChange={(e) => {
                onChange(updateValue(storeKeys, e.target.value))
            }}
        />
    </>
}
```
    
This can be used to delete the current storeKeys entry in the validity scope at unmount of the current widget/widgetstack:

```js
React.useEffect(() => {
    return () => cleanUp(storeKeys, 'validity') 
});
```

### Editor Provider

- Provider: `EditorProvider`
- Hook: `useEditor`
- HOC: `withEditor`
- Properties/ContextData:
    - `widgets` JS-object
    - `showValidity` boolean
    - `t` : `function` translator function
    
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
            noGrid // not a provider property, so pushed to the widgetStack, available for the GridHandler
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
    const {validity} = useSchemaStore();
    
    return <p style={{fontWeight: someCustomProp ? 'bold' : 'normal'}}>
        {isInvalid(validity) ? 'invalid' : 'valid'}
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

### SchemaEditorRenderer

Layer to get the needed widget by the current schema and let it render with [ValueWidgetRenderer](#valuewidgetrenderer).

### SchemaRootRenderer

Connects to the current context and extracts the starting schema, renders the `widgets.RootRenderer` 

## Widget Renderer

### ValueWidgetRenderer

### WidgetStackRenderer

### NextPluginRenderer

Used for plugin rendering, see: [creating plugins](/docs/widget-plugins#creating-plugins).

#### NextPluginRendererMemo

Same as NextPluginRenderer, but as memoized function, used in e.g. ObjectPlugins when they are using [useSchemaData](#editor-data-provider), see: [creating plugins](/docs/widget-plugins#creating-plugins).

## Utils

### createStore

Creates the initial store out of passed in values.

```js
const [data, setStore] = React.useState(() => createStore(createOrderedMap(initialData)));
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
- `allOf`, are ignored, should be resolved by e.g. [combining handler](/docs/widget-plugins#combininghandler)
- `if`, `then`, `else` are ignored, should be resolved by e.g. [conditional handler](/docs/widget-plugins#conditionalhandler), also `if` that are inside `allOf`

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
