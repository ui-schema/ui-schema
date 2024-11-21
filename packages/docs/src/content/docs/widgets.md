# Widgets & Widget Binding

> 📌 Here for the [**list of widgets**](/docs/overview#widget-list)?

This document is about **creating own widgets and design-system bindings** or changing existing ones.

A widget renders the UI and displays data and/or handles editing, **one widget handles one schema level** and may start rendering deeper nested levels.

Through the **modular approach** and easy definition of new widgets, the widget system can be used to create **complex, separated UI components**, where the orchestration can be done **from an external system**, like some backend API.

```typescript jsx
// Typings of widgets:
import { WidgetProps } from "@ui-schema/react/Widgets"
```

## Widget Composition

To change the behaviour or design of a widget, wrap it and use properties, overwrite it in the widget mapping.

See the widget documentation and typings of your design-system for available properties.

This example changes the `OptionsCheck` widget through composition and overwrites it in the widget mapping:

```jsx harmony
import React from 'react';
import {widgets, OptionsCheck} from "@ui-schema/ds-material";

// Using a `x-Axis` flow for the checkboxes, instead of `y-Axis` / flex-direction row instead of column
const OptionsCheckCustom = props => <OptionsCheck {...props} row={true}/>

const customWidgets = {
    ...widgets,
    custom: {
        ...widgets.custom,
        OptionsCheck: OptionsCheckCustom,
    },
};

export {customWidgets}
```

> see the more in-depth docs about the [widget composition concept](/docs/widgets-composition) and the basics about [`PluginStack`](/docs/core-pluginstack)

Use github to [request new widget properties](https://github.com/ui-schema/ui-schema/issues/new?template=widget_composition.md) - awesome if you add PRs!

See also [adding or overwriting widgets](#adding--overwriting-widgets)

## Creating Widgets

JSON-Schema is handled mostly by the `widgets.widgetPlugins` for you, focus on the behaviour of the widget, connect it through the provided properties and the HOC `extractValue` (only non-scalar values).

Each widget gets properties provided by the root schema renderer or added from plugins. When rendering nested schemas, all passed down `props` to [`PluginStack`](/docs/core-pluginstack) are passed to the nested widget(s) - except those removed by [`WidgetRenderer`](/docs/core-renderer#widgetrenderer).

Received properties from `WidgetRenderer` or accumulated in plugins & pluginSimpleStack:

- `value` : `{*}` Plugins receive for any value, Widgets only for scalar
- `onChange` : `{function}` store updater function, see [updating utils](/docs/core-store#store-updating--onchange)
- `storeKeys` : `{List}`
- `ownKey` : `{string|integer}` *deprecated, will be removed in `0.5.0` use `storeKeys.last()` instead*
- `schema` : `{Map}` the schema of the current widget
- `parentSchema` : `{Map}` the schema of the parent widget
- `required` : `{boolean}`, extracted from `parentSchema` and transformed from `undefined|List` to `boolean` by `requiredValidator`
- `valid` : `{boolean}` if this schema level got some error, detected/changed from the `widgets.widgetPlugins`
- `showValidity` : `{boolean}` if the errors/success should be visible
- `errors` : `{ValidatorErrorsType}` validation errors, added from the `widgets.widgetPlugins` for the current widget/schema-level

Use typings:

```typescript jsx
// for any scalar widgets:
const WidgetComp1 = React.ComponentType<WidgetProps & WithScalarValue>

// or use e.g. the `extractValue` HOC:
const WidgetComp2 = React.ComponentType<WidgetProps & WithValue>

export const FormGroupBase: React.ComponentType<WidgetProps & WithValue> = (props) => {
}
export const FormGroup: React.ComponentType<WidgetProps> = extractValue(memo(FormGroupBase))
```

See [how to add custom widgets](#adding--overwriting-widgets) to a design system binding.

### Simplest Text Widget

Example of a really simple text widget (in typescript):

```typescript jsx
import React from 'react';
import { TranslateTitle, WidgetProps } from '@ui-schema/ui-schema';

const Widget = ({
                    value, storeKeys, onChange,
                    required, schema,
                    errors, valid,
                    ...props
                }: WidgetProps) => {
    return <>
        <label><TranslateTitle schema={schema} storeKeys={storeKeys}/></label>

        <input
            type={'text'}
            required={required}
            value={value || ''}
            onChange={(e) => {
                onChange({
                    storeKeys,
                    scopes: ['value'],
                    type: 'set',
                    data: {
                        value: e.target.value,
                    },
                    schema,
                    required,
                })
            }}
        />
    </>
}
```

## Create Design-System Binding

Each UIGenerator receives an `widgets` object containing all HTML components and the plugins that should be used for rendering and validation.

Create a complete custom binding or only `import` the components you need and optimize your bundle size!

[Typing for `WidgetsBinding`](https://github.com/ui-schema/ui-schema/blob/master/packages/ui-schema/src/WidgetsBinding.ts).

- `ErrorFallback` shows error for exceptions during of a widget rendering, when not set turns of the error boundary
- `RootRenderer` main wrapper around everything
- `GroupRenderer` wraps any object that is not a widget
- `WidgetRenderer` the actual widget matching & rendering component, rendered as "last plugin" by `getNextPlugin`
- `widgetPlugins` widget plugin system
    - e.g. used to handle json schema `default`
    - see [how to create widget plugins](/docs/plugins#create-a-widget-plugin)
- `pluginSimpleStack` the simple plugins
    - e.g. used to validate json schema `required`
    - see [how to create simple plugins](/docs/plugins#create-a-simple-plugin)
- `custom` contains widgets mapping with schema's `widget`
- `types` contains native-type widgets mapping with schema's `type`

Example default binding for `material-ui` can be used as template:

- [Grid Widgets](https://github.com/ui-schema/ui-schema/tree/master/packages/ds-material/src/Grid.js) - all special widgets responsible for the grid
- [widgetPlugins Definition](https://github.com/ui-schema/ui-schema/tree/master/packages/ds-material/src/widgetPlugins.js) - binding of plugin
- [Widgets Base Definition](https://github.com/ui-schema/ui-schema/tree/master/packages/ds-material/src/widgetsBinding/widgetsBinding.ts) - binding of widgetPlugins, validators and root-grid and the actual widgets for a design-system

[Contributing a new ds-binding?](/docs/design-systems#add-design-system-package)

### Lazy Loading Bindings

> ❌ Concept, usable but risky
>
> not all widgets are getting exported perfectly atm.

- needs more exports/splits from ui-schema/each ds ❌
- needs react-loadable/react.lazy support (deep testing is missing) ❌

Lazy bindings are only loading the needed widgets when really rendering, this can be achieved with code-splitting, through dynamic imports and e.g. `React.lazy` or `react-loadable`.

It is only recommended for bigger widgets, using it for e.g. `type` widget is mostly unneeded - as used anywhere and would produce a lot small network-requests.

#### Example with react-loadable

```js
import React from "react";
import Loadable from 'react-loadable';
import {RootRenderer, GroupRenderer} from "@ui-schema/ds-material/Grid";
import {widgetPlugins} from "@ui-schema/ds-material/widgetPlugins";
import {validators} from '@ui-schema/ui-schema/Validators/validators';
import {WidgetRenderer} from '@ui-schema/ui-schema/WidgetRenderer';

// Build the loadable widgets
const StringRenderer = Loadable({
    loader: () => import('@ui-schema/ds-material/Widgets/TextField').then(module => module.StringRenderer),
    loading: (props) => 'Loading Widget',// add here your fancy loading component
});

const MyFallbackComponent = ({type, widget}) => (
    <div>
        <p>
            <strong>Error in Widget!</strong>
        </p>
        <p>
            <strong>Type:</strong>
            {JSON.stringify(type)}
        </p>
        <p>
            <strong>Widget:</strong>
            {widget}
        </p>
    </div>
);

export const widgets = {
    ErrorFallback: MyFallbackComponent,
    RootRenderer,
    GroupRenderer,
    WidgetRenderer,
    widgetPlugins,
    pluginSimpleStack: validators,
    types: {
        // supply your needed native-type widgets
        string: StringRenderer,
    },
    custom: {}
}
```

## Adding / Overwriting Widgets

Use the existing exported binding of your design-system and add or overwrite widgets or add new plugins.

- overwriting is recommended for composition widgets or when using the overwritten in the same page/app
- or when using the [lazy-loading widgets](#lazy-loading-bindings)

Simple example of adding a new widget to the binding:

```js
import {widgets} from "@ui-schema/ds-material/BindingType";

const CustomNumberRenderer = () => /* todo: implement */ null;
const CustomSelect = () => /* todo: implement */ null;

// Multi Level destructure-merge to overwrite and clone and not change the original ones (shallow-copy)
export const customWidgets = {
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
```

Example widget binding **with typings**:

```typescript
import React from "react";
import { widgets, MuiWidgetsBinding, MuiWidgetsBindingTypes, MuiWidgetsBindingCustom } from "@ui-schema/ds-material/BindingType";
import { WidgetProps, WidgetsBindingFactory, WithScalarValue } from "@ui-schema/ui-schema";

const CustomNumberRenderer = (props: React.ComponentType<WidgetProps<CustomWidgetsBinding> & WithScalarValue>) => /* todo: implement */ null;
const CustomSelect = (props: React.ComponentType<WidgetProps<CustomWidgetsBinding> & WithScalarValue>) => /* todo: implement */ null;

export interface CustomWidgetsType {
    types: {
        integer: React.ComponentType<WidgetProps<CustomWidgetsBinding> & WithScalarValue>
        number: React.ComponentType<WidgetProps<CustomWidgetsBinding> & WithScalarValue>
    }
    custom: {
        CustomSelect: React.ComponentType<WidgetProps<CustomWidgetsBinding> & WithScalarValue>
    }
}

export type CustomWidgetsBinding = WidgetsBindingFactory<{}, MuiWidgetsBindingTypes<{}>, MuiWidgetsBindingCustom<CustomWidgetsType>>
export const customWidgets: CustomWidgetsBinding = {
    ...widgets,
    types: {
        ...widgets.types,
        integer: CustomNumberRenderer,
        number: CustomNumberRenderer,
    },
    custom: {
        ...widgets.custom,
        CustomSelect: CustomSelect,
    }
}
```

This example shows how new plugins can be added:

```js
import {widgets,} from "@ui-schema/ds-material";

const CustomPlugin = () => /* todo: implement */ null;

// Multi Level destructure-merge to overwrite and clone and not change the original ones (shallow-copy)

const customPluginStack = [...widgets.widgetPlugins];
// insert a custom plugin before the ValidityReporter (last plugin by default)
customPluginStack.splice(customPluginStack.length - 1, 0, CustomPlugin);

const customWidgets = {
    ...widgets,
    widgetPlugins: customPluginStack,
};

export {customWidgets}
```
