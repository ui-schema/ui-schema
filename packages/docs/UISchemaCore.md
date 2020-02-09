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

Main entry point for every new Schema Editor, renders the RootRenderer and renders the whole schema with `SchemaEditorRenderer`. 

### NestedSchemaEditor

Automatic nesting schema-editor, uses the parent contexts, starts a SchemaEditor at directly at schema-level with `SchemaEditorRenderer`.

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

### SchemaEditorRenderer

Layer to get the needed widget by the current schema and let it render for scalar values with [ValueWidgetRenderer](#valuewidgetrenderer) and for others with [ValuelessWidgetRenderer](#valuewidgetrenderer). 

## Widget Renderer

### ValueWidgetRenderer

### ValuelessWidgetRenderer

### WidgetStackRenderer

### NextPluginRenderer
