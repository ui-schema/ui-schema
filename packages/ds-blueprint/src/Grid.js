import React from "react";
import {NextPluginRenderer} from "@ui-schema/ui-schema";

const SchemaGridItem = ({schema, children, defaultMd}) => {
    const view = schema ? schema.get('view') : undefined;

    const viewXs = view ? (view.get('sizeXs') || 12) : 12;
    const viewSm = view ? view.get('sizeSm') : undefined;
    const viewMd = view ? view.get('sizeMd') : defaultMd;
    const viewLg = view ? view.get('sizeLg') : undefined;

    let gridClasses = [];
    if(viewXs) {
        gridClasses.push('col-xs-' + viewXs);
    }
    if(viewSm) {
        gridClasses.push('col-sm-' + viewSm);
    }
    if(viewMd) {
        gridClasses.push('col-md-' + viewMd);
    }
    if(viewLg) {
        gridClasses.push('col-lg-' + viewLg);
    }

    return <div className={gridClasses.join(' ')}>
        {children}
    </div>
};

const RootRenderer = props => <>{props.children}</>;

const GroupRenderer = ({/*schema,*/ children}) => <div className={'row'}>
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
