# Grid Handler

These components are the wire/grid in which the widgets are rendered.

[![Component Examples](https://img.shields.io/badge/Examples-green?labelColor=1d3d39&color=1a6754&logoColor=ffffff&style=flat-square)](#demo-ui-generator) [![supports Material-UI Binding](https://img.shields.io/badge/Material-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=mui)](#material-ui)

- `RootRenderer`, defined as special widget: `widgets.RootRenderer`
    - the first component that is rendered for the generator, containing the root-level
- `GroupRenderer`, defined as special widget: `widgets.GroupRenderer`
    - has the GridHandler as children
    - each native-object is wrapped with this (default), each property of an `object` results in a new child
- `GridHandler`, plugin in the widgetPlugins, you should not need to configure/add it
    - if the prop `noGrid` is passed through the stack, the grid item is not rendered
    - added to the widget-stack
        - thus each widget is automatically wrapped with the needed grid handler to build responsive grid

Disabling the GridHandler with `noGrid` can - for example - be done by passing it down from `PluginStack`:

```js
<PluginStack
    showValidity={showValidity}
    storeKeys={storeKeys.push(i)}
    schema={schema.get('items')}
    noGrid
/>
```

## Design System

### Material-UI

- `GroupRenderer`
    - schema keywords
        - `view.spacing` is used as `spacing` for material-ui grid
- `GridHandler`
    - schema keywords
        - `view.align` is used as `style.textAlign`
        - `view.noGrid` same as `noGrid` prop

```js
import {
    RootRenderer, GroupRenderer,
    /* not needed to add, is registered in `widgetPlugins`
        SchemaGridHandler, SchemaGridItem,
    */
} from "@ui-schema/ds-material/Grid";
import {widgetPlugins} from "@ui-schema/ds-material/widgetPlugins";
import {validators} from "@ui-schema/ui-schema/Validators";

const widgets = {
    RootRenderer,
    GroupRenderer,
    widgetPlugins: widgetPlugins,
    pluginSimpleStack: validators,
    // ... rest of non-type widget ...
    types: {},
    custom: {},
};

export {widgets};
```

Components:

- `SchemaGridHandler` plugin compatible component, should exist in the widget-stack
- `SchemaGridItem` the actual widget that is capable of parsing the schema into `n columns width when window size is y`
