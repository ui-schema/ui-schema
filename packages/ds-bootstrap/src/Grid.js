import React from "react";
import {NextPluginRenderer} from "@ui-schema/ui-schema";
import clsx from "clsx";

const SchemaGridItem = ({children, schema}) => {
    let classNameArray = [];
    const view = schema ? schema.getIn(['view']) : undefined;
    if(view && view.get('sizeXs')) {
        classNameArray.push('col-' + view.get('sizeXs'));
    } else {
        classNameArray.push('col-12');
    }
    if(view && view.get('sizeSm')) {
        classNameArray.push('col-sm-' + view.get('sizeSm'));
    }
    if(view && view.get('sizeMd')) {
        classNameArray.push('col-md-' + view.get('sizeMd'));
    }
    if(view && view.get('sizeLg')) {
        classNameArray.push('col-lg-' + view.get('sizeLg'));
    }
    if(view && view.get('sizeXl')) {
        classNameArray.push('col-xl-' + view.get('sizeXl'));
    }

    return <div
        className={classNameArray.join(' ')}
    >
        {children}
    </div>
};

const RootRenderer = props => <div className={'row'}>{props.children}</div>;

const GroupRenderer = ({children}) => <div className={clsx('row', 'px-0')}>
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
