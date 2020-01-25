# Widget System

>
> ✔ working, not expected to change (that much) breaking in the near future
>

A widget is responsible to render the UI and either display or make the editing of the data possible, it handles one schema level and may connect to another nested SchemaEditor if it handles a special object/group.

Through the modular approach and easy definition of a new widget, the widget system can be used to create complex, separated UI components, where the orchestration can be done from an external system like some backend API.

- `RootRenderer` main wrapper around everything
- `GroupRenderer` wraps an object that is not a widget (native JS-object)
    - props: `schema`
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
    NextPluginRenderer, DefaultHandler, MinMaxValidator
} from "@ui-schema/ui-schema";

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

const GroupRenderer = ({schema, children}) => <SchemaGridItem schema={schema}>
    <Grid container spacing={2} wrap={'wrap'}>
        {children}
    </Grid>
</SchemaGridItem>;

const SchemaGridHandler = (props) => {
    const {
        schema,
    } = props;

    return <SchemaGridItem schema={schema}>
        <NextPluginRenderer {...props}/>
    </SchemaGridItem>;
};

const widgetStack = [
    MinMaxValidator,
    SchemaGridHandler,
    DefaultHandler,
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

## Creating Widgets

You need to show content and inputs in a special way? Something not supported (yet)? Just create a widget with the functionality you need! JSON-Schema is handled mostly by the `widgetStack` for you, simply use the provided properties to build the behaviour of the widget.

Each widget get's a lot of properties provided by the root schema provided or added by plugins.

Properties from editor:

- `t` : `{function}` see [translation](./Localization.md#translation)
- `value` : `{*}`
- `storeKeys` : `{List}`
- `ownKey` : `{string|integer}`
- `setData` : `{function}`
- `schema` : `{Map}`
- `level` : `{integer}`
- `required` : `{boolean}` (Transformed from `undefined|List` to `boolean` by `RequiredValidator`)
- `valid` : `{boolean}`
- `showValidity` : `{boolean}`
- `errors` : `{List}`

See [plugins](./WidgetPlugins.md) for the rest of the provided properties.

## Docs

- [Overview](../../README.md)
- [UI-JSON-Schema](./Schema.md)
- [Widget System](./Widgets.md)
- [Widget Plugins](./WidgetPlugins.md)
- [Localization / Translation](./Localization.md)
- [Performance](./Performance.md)
