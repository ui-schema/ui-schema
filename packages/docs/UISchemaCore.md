# UI-Schema Core

Components and functions exported by `@ui-schema/ui-schema` for usage within design systems, plugins and widgets.

> todo: further detailed docs

## EditorStore

All functions/props that are passed to the root `SchemaEditor` are accessible through specific providers.

### Editor Data Provider

- Provider: `EditorDataProvider`
- Hook: `useSchemaData` 
- HOC: `withData`
- Properties/ContextData:
    - `store` : `{OrderedMap}`
    - `onChange` : `{function(function): OrderedMap}`
    - `schema` : `{OrderedMap}`

### Editor Invalidity Provider

- Provider: `EditorValidityProvider`
- Hook: `useSchemaValidity`
- HOC: `withValidity`
- Properties/ContextData:
    - `validity` : `{Map|undefined}`
    - `onValidity` : `{function(function): Map}`
    - `showValidity` : `{boolean}`
- Related Plugin: 
    - [ValidityReporter](./WidgetPlugins.md#validityreporter)
    
`onValidity` changes the hoisted state, see [comment in Basic Example](../../README.md#basic-example) on how to set it.

Example Create:

```js
import React from "react";
import {EditorValidityProvider} from "@ui-schema/ui-schema";

const CustomProvider = ({validity, showValidity, onValidity, children}) =>{
    return <EditorValidityProvider 
        validity={validity} 
        showValidity={showValidity}
        onValidity={onValidity}
        children={children}
    />;
}
```

Example Hook:

```js
import React from "react";
import {isInvalid, useSchemaValidity} from "@ui-schema/ui-schema";
const Comp = ({storeKeys, ...props}) => {
    const {
        validity, onValidity, // must be resolved by hook
        showValidity          // is also added to the props by `ValidityReporter` for ease of access
    } = useSchemaValidity();

    let invalid = isInvalid(validity, storeKeys, false); // Map, List, boolean: <if count>
    
    return null;// e.g. widget or plugin
};
```

### Editor Widgets Provider

- Provider: `EditorWidgetsProvider`
- Hook: `useSchemaWidgets`
- HOC: `withWidgets`
- Properties/ContextData:
    - `widgets` JS-object
    
Example Hook:

```js
import React from "react";
import {useSchemaWidgets} from "@ui-schema/ui-schema";
const Comp = () => {
    const {widgets} = useSchemaWidgets();

    const RootRenderer = widgets.RootRenderer;
    return <RootRenderer {...props}/>
};
```

Example HOC, recommended for memo usage:

```js
import React from "react";
import {withWidgets} from "@ui-schema/ui-schema";

const Comp = withWidgets(
    React.memo(
        ({widgets, ...props}) => {
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

- allows overwriting `showValidity` easily by attaching itself to the parent's validity reporter. 
- the [widget provider](#editor-widgets-provider) can be used to render other widgets inside the nested as in the parent
- data/store must not be pushed through

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
    isInvalid, useSchemaValidity
} from "@ui-schema/ui-schema";

const CustomFooter = ({someCustomProp}) => {
    // access the editor context, also available e.g.: useSchemaWidgets, useSchemaData
    const {validity} = useSchemaValidity();
    
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

Layer to get the needed widget by the current schema and let it render for scalar values with [ValueWidgetRenderer](#valuewidgetrenderer) and for others with [ValuelessWidgetRenderer](#valuewidgetrenderer).

### SchemaRootRenderer

Connects to the current context and extracts the starting schema, renders the `widgets.RootRenderer` 

## Widget Renderer

### ValueWidgetRenderer

### ValuelessWidgetRenderer

### WidgetStackRenderer

### NextPluginRenderer

Used for plugin rendering, see: [creating plugins](./WidgetPlugins.md#creating-plugins).

#### NextPluginRendererMemo

Same as NextPluginRenderer, but as memoized function, used in e.g. ObjectPlugins when they are using [useSchemaData](#editor-data-provider), see: [creating plugins](./WidgetPlugins.md#creating-plugins).

## Utils

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

See [performance](./Performance.md) for the reasons and philosophy behind it.

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
- `allOf`, are ignored, should be resolved by e.g. [combining handler](./WidgetPlugins.md#combininghandler)
- `if`, `then`, `else` are ignored, should be resolved by e.g. [conditional handler](./WidgetPlugins.md#conditionalhandler), also `if` that are inside `allOf`

## Docs

- [Overview](../../README.md)
- [UI JSON-Schema](./Schema.md)
- [Widget System](./Widgets.md)
- [Widget Plugins](./WidgetPlugins.md)
- [Localization / Translation](./Localization.md)
- [Performance](./Performance.md)
