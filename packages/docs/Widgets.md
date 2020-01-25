# Widgets

A widget is responsible to render the UI and either display or make the editing of the data possible, it handles one schema level and may connect to another nested SchemaEditor if it handles a special object/group.

- `RootRenderer` main wrapper around everything
- `GroupRenderer` wraps an object that is not a widget (native JS-object)
    - props: `schema`
- `widgetStack` is a widget plugin system, this wraps all widgets individually and is e.g. used to handle json schema `default`
    - `{current, Widget, widgetStack, ...props}` prop signature of each plugin
    - `current` index/current position in stack
    - `Widget` actual component to render
    - `widgetStack` whole stack that is currently rendered
    - `props` are the props which are getting pushed to to `Widget`
    - use the `<NextPluginRenderer {...props} newProp={false}/>` to automatically render the plugins nested, `newProp` is available in the widget this way
- `custom` contains widgets mapping with schema's `widget`
- `types` contains widgets mapping with schema's `type`
    
Example default binding `material-ui`:

```js
import React from "react";
import Grid from "@material-ui/core/Grid";
import {NumberRenderer, StringRenderer, TextRenderer} from "@ui-schema/ds-material";

const SchemaGridItem = ({schema, children}) => {
    return <Grid
        item
        xs={schema ? schema.getIn(['view', 'sizeXs']) : undefined}
        sm={schema ? schema.getIn(['view', 'sizeSm']) : undefined}
        md={schema ? schema.getIn(['view', 'sizeMd']) : undefined}
        lg={schema ? schema.getIn(['view', 'sizeLg']) : undefined}
        xl={schema ? schema.getIn(['view', 'sizeXl']) : undefined}
    >
        {children}
    </Grid>
};

const widgetStack = ({schema, children}) => <SchemaGridItem schema={schema}>
    {children}
</SchemaGridItem>;

const RootRenderer = props => <Grid container spacing={0}>{props.children}</Grid>;

const GroupRenderer = ({schema, children}) => <SchemaGridItem schema={schema}>
    <Grid container spacing={2} wrap={'wrap'}>
        {children}
    </Grid>
</SchemaGridItem>;

const widgets = {
    RootRenderer,// wraps the whole editor
    GroupRenderer,// wraps any `object` that has no custom widget
    widgetStack,// optional: wraps any rendered widget
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

## Docs

- [Overview](../../README.md)
- [UI-JSON-Schema](./Schema.md)
- [Widget System](./Widgets.md)
- [Schema-Plugins](./SchemaPlugins.md)
- [Localization / Translation](./Localization.md)
- [Performance](./Performance.md)
