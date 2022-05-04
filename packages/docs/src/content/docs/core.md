# UI-Schema Core

The UI Schema core consists of `Providers`, `Renderers`, the plugin system and validators.

It supports different ways of creation and UI orchestration, focused for a great developer experience and fast UIs.

> todo: document the entry point styles of the FlowChart and their usage here, use the other `Core` docs as component documentations

- [Generator & Renderer](/docs/core-renderer): components which start the whole form or are part of the automatic/autowired rendering flow
- [Store](/docs/core-store): internal data handling and the needed providers, each new UI Generator needs its own store
- [Meta](/docs/core-meta): available `widgets` and translation `t` options, best is to have one [lifted up](https://reactjs.org/docs/lifting-state-up.html) `UIMetaProvider` for many `UIStoreProvider`
- [PluginStack](/docs/core-pluginstack): wraps each widget and executes plugins / validators
- [UIApi](/docs/core-uiapi): utilities for network connected forms
- [Utils](/docs/core-utils): common utilities for immutable and other logic parts

## UIProvider

> ⚠ deprecated, will be removed in `v0.5.0`

Convenience Provider for both: UIStore & UIMeta, just pass everything down to the provider, the UIRootRenderer connects to the provider automatically. Only recommended for small usages, for most cases a lifted up `UIMetaProvider` makes more sense.

```js
import React from "react";
import {
    UIProvider, UIRootRenderer,
    isInvalid, useUIStore,
} from "@ui-schema/ui-schema";

const CustomFooter = ({someCustomProp}) => {
    // access the editor context, also available e.g.: useSchemaWidgets, useSchemaData
    const {store} = useUIStore();

    return <p style={{fontWeight: someCustomProp ? 'bold' : 'normal'}}>
        {isInvalid(store.getValidity()) ? 'invalid' : 'valid'}
    </p>
}

const CustomEditor = ({someCustomProp, ...props}) => (
    <UIProvider {...props}>
        <div>
            <UIRootRenderer schema={props.schema}/>
            <div>
                <CustomFooter someCustomProp={someCustomProp}/>
            </div>
        </div>
    </UIProvider>
);
```

## Flowchart

[![flowchart](/Flowchart-SchemaEditor.svg)](https://ui-schema.bemit.codes/Flowchart-SchemaEditor.svg)
