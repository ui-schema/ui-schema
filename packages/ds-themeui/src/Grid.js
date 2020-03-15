import React from "react";
import {Grid, Box} from 'theme-ui'
import {NextPluginRenderer} from "@ui-schema/ui-schema";

const SchemaGridItem = ({schema, children, defaultMd}) => {
    const view = schema ? schema.get('view') : undefined;

    const viewXs = view ? (view.get('sizeXs') || 12) : 12;
    const viewSm = view ? view.get('sizeSm') : undefined;
    const viewMd = view ? view.get('sizeMd') : defaultMd;
    const viewLg = view ? view.get('sizeLg') : undefined;
    const viewXl = view ? view.get('sizeXl') : undefined;

    return <Box
        p={2}
        sx={{
            width: [
                viewXs ? (100 / (12 / viewXs)) + '%' : null,
                viewSm ? (100 / (12 / viewSm)) + '%' : null,
                viewMd ? (100 / (12 / viewMd)) + '%' : null,
                viewLg ? (100 / (12 / viewLg)) + '%' : null,
                viewXl ? (100 / (12 / viewXl)) + '%' : null,
            ],
        }}
    >
        {children}
    </Box>
};

const RootRenderer = props => <Grid>{props.children}</Grid>;

const GroupRenderer = ({/*schema,*/ children}) => <div style={{display: 'flex', flexWrap: 'wrap'}}>
    {children}
</div>;

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
