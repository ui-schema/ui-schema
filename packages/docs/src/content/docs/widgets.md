# Widget System

> 📌 Here for the [**list of widgets**](/docs/overview#widget-list)?

This document is about creating own widgets, design-system bindings and changing the existing ones.

A widget is responsible to render the UI and either display or make the editing of the data possible, it handles one schema level and may connect to another nested SchemaEditor.

Through the modular approach and easy definition of a new widget, the widget system can be used to create complex, separated UI components, where the orchestration can be done from an external system like some backend API.

## Creating Widgets

>
> ✔ working, not expected to change (that much) breaking in the near future
>

JSON-Schema is handled mostly by the `widgetStack` for you, focus on the behaviour of the widget, connect it through the provided properties and the HOC `extractValue` (only non-scalar values).

Each widget get's a properties provided by the root schema renderer or added by plugins.

Properties from editor:

- `t` : `{function}` see [translation](/docs/localization#translation)
- `value` : `{*}` (Plugins receive for any value, Widgets only for scalar values)
- `onChange` : `{function}`
- `storeKeys` : `{List}`
- `ownKey` : `{string|integer}`
- `schema` : `{Map}`
- `parentSchema` : `{Map}`
- `level` : `{integer}` how deep in the schema it is, incremented automatically for native-objects, must be done manually when using `NestedSchemaEditor`
- `required` : `{boolean}`, extracted from `parentSchema` and transformed from `undefined|List` to `boolean` by `RequiredValidator`
- `valid` : `{boolean}` if this schema level got some error, detected/changed from the widgetStack
- `showValidity` : `{boolean}` if the errors/success should be visible
- `errors` : `{List}` validation errors, added from the widgetStack for the current widget/schema-level

See [Simplest Text Widget](/docs/core#simplest-text-widget) for a basic widget example.

See [how to add the custom widgets](#adding--overwriting-widgets).

See [plugins](/docs/widget-plugins) for the rest of the provided properties.


## Create Design-System Binding

>
> ✔ working, not expected to change (that much) breaking in the near future
>

Each SchemaEditor receives an `widgets` object containing all HTML components and the plugins that should be used for rendering.

Create a complete custom or only the components you need.

- `RootRenderer` main wrapper around everything
- `GroupRenderer` wraps an object that is not a widget, used by the internal `ObjectRenderer` widget
- `widgetStack` is the widget plugin system, this wraps all widgets individually
    - e.g. used to handle json schema `default`
    - see [how to create widget plugins](/docs/widget-plugins#creating-validator-plugins)
- `custom` contains widgets mapping with schema's `widget`
- `types` contains widgets mapping with schema's `type`
    
Example default binding `material-ui`:

```js
import React from "react";
import {Grid} from "@material-ui/core";
import {
    NextPluginRenderer,
    CombiningHandler, DefaultHandler, DependentHandler, ConditionalHandler,
    ValidityReporter, Validator, validators,
} from "@ui-schema/ui-schema";

import {
    StringRenderer, NumberRenderer /* and more widgets */
} from "@ui-schema/ds-material";

const SchemaGridItem = ({schema, children, defaultMd}) => {
    const view = schema ? schema.get('view') : undefined;

    const viewXs = view ? (view.get('sizeXs') || 12) : 12;
    const viewSm = view ? view.get('sizeSm') : undefined;
    const viewMd = view ? view.get('sizeMd') : defaultMd;
    const viewLg = view ? view.get('sizeLg') : undefined;
    const viewXl = view ? view.get('sizeXl') : undefined;

    return <Grid
        item
        xs={viewXs}
        sm={viewSm}
        md={viewMd}
        lg={viewLg}
        xl={viewXl}
    >
        {children}
    </Grid>
};

const RootRenderer = props => <Grid container spacing={0}>{props.children}</Grid>;

const GroupRenderer = ({children}) => <Grid container spacing={2} wrap={'wrap'}>
    {children}
</Grid>;

const SchemaGridHandler = (props) => {
    const {schema,} = props;

    return <SchemaGridItem schema={schema}>
        <NextPluginRenderer {...props}/>
    </SchemaGridItem>;
};

const widgetStack = [
    SchemaGridHandler,
    CombiningHandler,
    DefaultHandler,
    DependentHandler,
    ConditionalHandler,
    Validator,
    ValidityReporter,
];

const widgets = {
    RootRenderer,  // wraps the whole editor
    GroupRenderer, // wraps any `object` that has no custom widget
    validators,    // validator functions
    widgetStack,   // widget plugin system
    types: {
        // supply your needed native-type widgets
        number: NumberRenderer,
        string: StringRenderer,
    },
    custom: {
        // supply your needed custom widgets
        Text: TextRenderer,
    },
};

export {widgets}
```

[Contributing a new ds-binding?](/docs/design-systems#add-design-system-package)

### Lazy Loading Bindings

> ❌ Concept, not implemented
>
> Not all widgets are getting exported perfectly atm.

- needs more exports/splits from ui-schema/each ds ❌
- needs react-loadable/react.lazy support ❌
- import should work without `/es` ❌

Lazy bindings are only loading the needed widgets when really rendering, this can be achieved with code-splitting, through dynamic imports and e.g. `React.lazy` or `react-loadable`.

Example with react-loadable

```js
import React from 'react';
import Loadable from 'react-loadable';
import {widgetStack} from '@ui-schema/ds-material/es/widgetStack';
import {validators} from "@ui-schema/ui-schema";

// Build the loadable widgets
const StringRenderer = Loadable({
    loader: () => import('@ui-schema/ds-material/es/Widgets/TextField').then(module => module.StringRenderer),
    loading: (props) => <p>Loading Widget</p>,// add here your fancy loading component
});

const widgets = {
    RootRenderer,  // wraps the whole editor
    GroupRenderer, // wraps any `object` that has no custom widget
    validators,    // validator functions
    widgetStack,   // widget plugin system
    types: {
        // supply your needed native-type widgets
        string: StringRenderer,
    },
    custom: {
        // supply your needed custom widgets
        Text: TextRenderer,
    },
};

export {widgets}
```

## Adding / Overwriting Widgets

>
> ✔ working, not expected to change (that much) breaking in the near future
>

Use the existing exported binding of your design-system and add or overwrite widgets or add new plugins.

- overwriting is only recommended when using the overwritten on the same page/app
- or when using the [lazy-loading widgets](#lazy-loading-bindings)

Simple example of adding a new widget to the binding, can be used for overwriting existing ones:

```js
import {widgets,} from "@ui-schema/ds-material";

const CustomNumberRenderer = () => /* todo: implement */ null;
const CustomSelect = () => /* todo: implement */ null;

// Multi Level destructure-merge to overwrite and clone and not change the original ones
const customWidgets = {
    ...widgets,
    types: {
        ...widgets.types, 
        number: CustomNumberRenderer,
    },
    custom: {
        ...widgets.custom,
        Select: CustomSelect,
    },
};

export {customWidgets}
```

This example shows how new plugins can be added:

```js
import {widgets,} from "@ui-schema/ds-material";

const CustomPlugin = () => /* todo: implement */ null;

// Multi Level destructure-merge to overwrite and clone and not change the original ones

const customWidgetStack = [...widgets.widgetStack];
// insert a custom plugin before the ValidityReporter (last plugin by default)
customWidgetStack.splice(customWidgetStack.length - 1, 0, CustomPlugin);

const customWidgets = {
    ...widgets,
    widgetStack: customWidgetStack,
};

export {customWidgets}
```
