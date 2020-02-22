import React from "react";
import {NextPluginRenderer} from "@ui-schema/ui-schema";
import clsx from "clsx";

const SchemaGridItem = ({children, schema}) => {
    let classNameArray = [];
    const view = schema ? schema.getIn(['view']) : undefined;
    classNameArray.push('pl-0');
    if(view && view.get('sizeXs')) {
        classNameArray.push('col-' + view.get('sizeXs'));
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
    if (classNameArray.length < 1) {
        classNameArray.push('container-fluid', 'px-0', 'mx-0');
    }

    return <div
        className={classNameArray.join(' ')}
    >
        {children}
    </div>
};

const RootRenderer = props => <React.Fragment>{props.children}</React.Fragment>;

const GroupRenderer = ({children}) => <div className={clsx('row', 'mx-0', 'px-0')}>
    {children}
</div>;

const SchemaGridHandler = (props) => {
    const {
        schema,
    } = props;

    return <SchemaGridItem schema={schema}>
        <NextPluginRenderer {...props}/>
    </SchemaGridItem>;
};

export {SchemaGridHandler, SchemaGridItem, RootRenderer, GroupRenderer};
