# UI Schema: Meta

## UIMetaProvider

Saves additional functions and meta-data for all renderers & generators.

- Provider: `UIMetaProvider`
- Hook: `useUIMeta`
- HOC: `withUIMeta`
- Properties/ContextData:
    - `widgets` JS-object, the [widget binding](/docs/widgets)
    - `t`: `function` translator function, see [translation](/docs/localization#translation)
    - use additional props to automatically supply your PluginStack with custom extensions
        - all passed in `props` are available in HOOKs and HOCs
        - the `PluginStack` passes down all - but allows to overwrite any by supplying the same `props` to `<PluginStack/>`

Example Hook:

```js
import React from "react";
import {useUIMeta} from "@ui-schema/ui-schema";

const Comp = () => {
    const {widgets} = useUIMeta();

    const RootRenderer = widgets.RootRenderer;
    return <RootRenderer {...props}/>
};
```

Example HOC:

```js
import React from "react";
import {withUIMeta, memo} from "@ui-schema/ui-schema";

const Comp = withUIMeta(
    memo(
        ({widgets, t, ...props}) => {
            const RootRenderer = widgets.RootRenderer;
            return <RootRenderer {...props}/>
        }
    )
);
```

### Typescript Custom UIMetaContext

Customize `UIMetaContext`:

```typescript tsx
export interface UIMetaCustomContext {
    handleStuff: () => 'stuff'
}

<UIMetaProvider<UIMetaCustomContext>
    widgets={customWidgets}
    t={browserT}
    handleStuff={() => 'stuff'}
>
</UIMetaProvider>

const {handleStuff, widgets, t} = useUIMeta<UIMetaCustomContext>()

// typing to use `PluginStack`/`applyPluginStack` with custom context:
const WidgetTextField = applyPluginStack<UIMetaCustomContext>(StringRenderer)

// first additional widget props, second the custom context:
<PluginStack<{ readOnly: boolean }, UIMetaCustomContext>
    showValidity={showValidity}
    storeKeys={storeKeys.push('city') as StoreKeys}
    schema={schema.getIn(['properties', 'name']) as unknown as StoreSchemaType}
    parentSchema={schema}
    level={1}
    readOnly={false}
    // noGrid={false} (as grid-item is included in `PluginStack`)
/>
```
