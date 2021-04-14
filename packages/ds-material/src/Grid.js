import React from 'react';
import {Grid} from '@material-ui/core';
import {NextPluginRenderer} from '@ui-schema/ui-schema';

const SchemaGridItem = ({schema, children, defaultMd, style, className, classes}) => {
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
        style={style}
        className={className}
        classes={classes}
    >
        {children}
    </Grid>
};

const RootRenderer = props => <Grid container spacing={0}>{props.children}</Grid>;

const GroupRenderer = ({schema, noGrid, children, style, className, spacing = 2}) =>
    noGrid ? children :
        <Grid
            container wrap={'wrap'}
            spacing={typeof schema.getIn(['view', 'spacing']) === 'number' ? schema.getIn(['view', 'spacing']) : spacing}
            style={style}
            className={className}
        >
            {children}
        </Grid>;

const SchemaGridHandler = (props) => {
    const {schema, noGrid, isVirtual} = props;

    if(noGrid || isVirtual || schema.getIn(['view', 'noGrid'])) {
        return <NextPluginRenderer {...props}/>;
    }

    return <SchemaGridItem schema={schema} style={{textAlign: schema.getIn(['view', 'align'])}}>
        <NextPluginRenderer {...props}/>
    </SchemaGridItem>;
};

export {SchemaGridHandler, SchemaGridItem, RootRenderer, GroupRenderer};
