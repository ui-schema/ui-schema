# Widget System

>
> ✔ working, not expected to change (that much) breaking in the near future
>

A widget is responsible to render the UI and either display or make the editing of the data possible, it handles one schema level and may connect to another nested SchemaEditor if it handles a special object/group.

Through the modular approach and easy definition of a new widget, the widget system can be used to create complex, separated UI components, where the orchestration can be done from an external system like some backend API.

## Creating Widgets

>
> ✔ working, not expected to change (that much) breaking in the near future
>

You need to show content and inputs in a special way? Something not supported (yet)? Just create a widget with the functionality you need! JSON-Schema is handled mostly by the `widgetStack` for you, simply use the provided properties to build the behaviour of the widget.

Each widget get's a lot of properties provided by the root schema provided or added by plugins.

Properties from editor:

- `t` : `{function}` see [translation](./Localization.md#translation)
- `value` : `{*}` (only for scalar values)
- `onChange` : `{function}` (only for scalar values)
- `storeKeys` : `{List}`
- `ownKey` : `{string|integer}`
- `schema` : `{Map}`
- `parentSchema` : `{Map}`
- `level` : `{integer}`
- `required` : `{boolean}` (extracted from `parentSchema` and transformed from `undefined|List` to `boolean` by `RequiredValidator`)
- `valid` : `{boolean}` if this schema level got some error, detected/changed from the widgetStack, 
- `showValidity` : `{boolean}` added to the props by `InvalidityReporter`
- `errors` : `{List}` invalidity errors, added from the widgetStack for the current widget/schema-level
- `dependencies` : `{undefined|Map}` **removed in 0.0.5**

See [how to add the custom widgets](#adding--overwriting-widgets).

See [plugins](./WidgetPlugins.md) for the rest of the provided properties.


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
    - see [how to create widget plugins](./WidgetPlugins.md)
- `custom` contains widgets mapping with schema's `widget`
- `types` contains widgets mapping with schema's `type`
    
Example default binding `material-ui`:

```js
import React from "react";
import {Grid} from "@material-ui/core";
import {
    NextPluginRenderer,
    DefaultHandler, ValidityReporter, DependentHandler,
    MinMaxValidator, TypeValidator, MultipleOfValidator,
    ValueValidatorEnum, ValueValidatorConst,
    RequiredValidator, PatternValidator, ArrayValidator,
} from "@ui-schema/ui-schema";

import {
    StringRenderer, NumberRenderer /* and more widgets */
} from "@ui-schema/ds-material";

const SchemaGridItem = ({schema, children, defaultMd}) => {
    const view = schema ? schema.getIn(['view']) : undefined;
    const viewXs = view ? (view.getIn(['sizeXs']) || 12) : 12;
    const viewSm = schema ? schema.getIn(['view', 'sizeSm']) : undefined;
    const viewMd = schema ? schema.getIn(['view', 'sizeMd']) : defaultMd;
    const viewLg = schema ? schema.getIn(['view', 'sizeLg']) : undefined;
    const viewXl = schema ? schema.getIn(['view', 'sizeXl']) : undefined;

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
    const {
        schema,
    } = props;

    return <SchemaGridItem schema={schema}>
        <NextPluginRenderer {...props}/>
    </SchemaGridItem>;
};

const widgetStack = [
    DependentHandler,
    SchemaGridHandler,
    DefaultHandler,
    RequiredValidator,
    MinMaxValidator,
    TypeValidator,
    MultipleOfValidator,
    ValueValidatorConst,
    ValueValidatorEnum,
    PatternValidator,
    ArrayValidator,
    ValidityReporter,
];

const widgets = {
    RootRenderer,// wraps the whole editor
    GroupRenderer,// wraps any `object` that has no custom widget
    widgetStack,// widget plugin system
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

import {
    DefaultHandler, ValidityReporter, DependentHandler,
    MinMaxValidator, TypeValidator, MultipleOfValidator,
    ValueValidatorEnum, ValueValidatorConst,
    RequiredValidator, PatternValidator, ArrayValidator,
} from "@ui-schema/ui-schema";

import {SchemaGridHandler} from "@ui-schema/ds-material/es/Grid";

// Build the loadable widgets
const StringRenderer = Loadable({
    loader: () => import('@ui-schema/ds-material/es/Widgets/TextField').then(module => module.StringRenderer),
    loading: (props) => <p>Loading Widget</p>,// add here your fancy loading component
});

const widgetStack = [
    DependentHandler,
    SchemaGridHandler,
    DefaultHandler,
    RequiredValidator,
    MinMaxValidator,
    TypeValidator,
    MultipleOfValidator,
    ValueValidatorConst,
    ValueValidatorEnum,
    PatternValidator,
    ArrayValidator,
    ValidityReporter,
];

const widgets = {
    RootRenderer,// wraps the whole editor
    GroupRenderer,// wraps any `object` that has no custom widget
    widgetStack,// widget plugin system
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

This example shows how new plugins or widgets can be added, can be used to overwrite also.

- overwriting is only recommended when using the overwritten on the same page
- or when using the [lazy-loading widgets](#lazy-loading-bindings)

```js
import {widgets,} from "@ui-schema/ds-material";

const CustomNumberRenderer = () => /* todo: implement */ null;
const CustomSelect = () => /* todo: implement */ null;

const CustomPlugin = () => /* todo: implement */ null;

// Multi Level destructure-merge to overwrite and clone and not change the original ones

const customWidgetStack = [...widgets.widgetStack];
// insert a custom plugin before the ValidityReporter (last plugin by default)
customWidgetStack.splice(customWidgetStack.length - 1, 0, CustomPlugin);

const customWidgets = {
    ...widgets,
    widgetStack: customWidgetStack,
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

## Docs

- [Overview](../../README.md)
- [UI-JSON-Schema](./Schema.md)
- [Widget System](./Widgets.md)
- [Widget Plugins](./WidgetPlugins.md)
- [Localization / Translation](./Localization.md)
- [Performance](./Performance.md)
