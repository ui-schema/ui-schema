# Widgets

A widget is responsible to render the UI and either display or make the editing of the data possible, it handles one schema level and may connect to another nested SchemaEditor if it handles a special object/group.

- `RootRenderer` main wrapper around everything
- `GroupRenderer` wraps an object that is not a widget
    - props: `schema`
- `WidgetRenderer` is wrapped arround all final widgets
- `custom` contains widgets mapping with schema's `widget`
    - `Text`
- `types` contains widgets mapping with schema's `type`
    - `string`
    
Example default binding `material-ui`:

```js
import React from "react";
import Grid from "@material-ui/core/Grid";

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

const WidgetRenderer = ({schema, children}) => <SchemaGridItem schema={schema}>
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
    WidgetRenderer,// optional: wraps any rendered widget
    types: {
        // supply your needed native-type widgets
    },
    custom: {
        // supply your needed custom widgets
    },
};

export {widgets}
```
