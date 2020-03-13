import React from "react";
import {Grid} from "@material-ui/core";
import {NextPluginRenderer} from "@ui-schema/ui-schema";

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

const GroupRenderer = ({schema, children}) => <Grid container spacing={schema.getIn(['view', 'spacing']) || 2} wrap={'wrap'}>
    {children}
</Grid>;

const SchemaGridHandler = (props) => {
    const {
        schema, noGrid
    } = props;

    if(noGrid) {
        return <NextPluginRenderer {...props}/>;
    }

    return <SchemaGridItem schema={schema}>
        <NextPluginRenderer {...props}/>
    </SchemaGridItem>;
};

export {SchemaGridHandler, SchemaGridItem, RootRenderer, GroupRenderer};
