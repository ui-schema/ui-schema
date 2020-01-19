import React from "react";
import {Grid} from "@material-ui/core";

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

const WidgetRenderer = ({schema, children}) => <SchemaGridItem schema={schema} defaultMd={3}>
    {children}
</SchemaGridItem>;

export {SchemaGridItem, RootRenderer, GroupRenderer, WidgetRenderer};
