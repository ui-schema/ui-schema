import React from 'react';
import {Grid} from '@material-ui/core';
import {getNextPlugin} from '@ui-schema/ui-schema';

export const SchemaGridItem = ({schema, children, defaultMd, style, className, classes}) => {
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

export const RootRenderer = props => <Grid container spacing={0}>{props.children}</Grid>;

export const GroupRenderer = ({schema, noGrid, children, style, className, spacing = 2}) =>
    noGrid ? children :
        <Grid
            container wrap={'wrap'}
            spacing={typeof schema.getIn(['view', 'spacing']) === 'number' ? schema.getIn(['view', 'spacing']) : spacing}
            style={style}
            className={className}
        >
            {children}
        </Grid>;

export const SchemaGridHandler = (props) => {
    const {schema, noGrid, isVirtual, currentPluginIndex} = props;
    const next = currentPluginIndex + 1;
    const Plugin = getNextPlugin(next, props.widgets)

    if(noGrid || isVirtual || schema.getIn(['view', 'noGrid'])) {
        return <Plugin {...props} currentPluginIndex={next}/>
    }

    const align = schema.getIn(['view', 'align'])
    const style = React.useMemo(() => ({
        textAlign: align,
    }), [align])

    return <SchemaGridItem schema={schema} style={style}>
        <Plugin {...props} currentPluginIndex={next}/>
    </SchemaGridItem>;
};

