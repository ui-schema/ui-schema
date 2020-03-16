import React from "react";
import {Grid} from 'semantic-ui-react'
import {NextPluginRenderer} from "@ui-schema/ui-schema";

const SchemaGridItem = ({schema, children, defaultMd}) => {
    const view = schema ? schema.get('view') : undefined;

    const viewXs = view ? (view.get('sizeXs') || 16) : 16;
    const viewSm = view ? view.get('sizeSm') : undefined;
    const viewMd = view ? view.get('sizeMd') : defaultMd;
    const viewLg = view ? view.get('sizeLg') : undefined;
    const viewXl = view ? view.get('sizeXl') : undefined;

    return <Grid.Column
        mobile={viewXs}
        tablet={viewSm}
        computer={viewMd}
        largeScreen={viewLg}
        widescreen={viewXl}
    >
        {children}
    </Grid.Column>
};

const RootRenderer = props => <>{props.children}</>;

const GroupRenderer = ({/*schema,*/ children}) => <Grid>
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
