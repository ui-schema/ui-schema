import React from "react";
import {NextPluginRenderer} from "@ui-schema/ui-schema";

const SchemaGridItem = ({children, schema}) => {
    let classNameArray = [];
    const view = schema ? schema.getIn(['view']) : undefined;
    if(view && view.getIn(['sizeXs'])) {
        classNameArray.push('col-xs-' + view.getIn(['sizeXs']));
    }
    if(schema.getIn(['view', 'sizeSm'])) {
        classNameArray.push('col-sm-' + schema.getIn(['view', 'sizeSm']));
    }
    if(schema.getIn(['view', 'sizeMd'])) {
        classNameArray.push('col-md-' + schema.getIn(['view', 'sizeMd']));
    }
    if(schema.getIn(['view', 'sizeLg'])) {
        classNameArray.push('col-lg-' + schema.getIn(['view', 'sizeLg']));
    }
    if(schema.getIn(['view', 'sizeXl'])) {
        classNameArray.push('col-xl-' + schema.getIn(['view', 'sizeXl']));
    }


    return <div
        className={classNameArray.join(' ')}
    >
        {children}
    </div>
};

const RootRenderer = props => <div>{props.children}</div>;

const GroupRenderer = ({schema, children}) => <SchemaGridItem schema={schema}>
    {children}
</SchemaGridItem>;

const SchemaGridHandler = (props) => {
    const {
        schema,
    } = props;

    return <SchemaGridItem schema={schema}>
        <NextPluginRenderer {...props}/>
    </SchemaGridItem>;
};

export {SchemaGridHandler, SchemaGridItem, RootRenderer, GroupRenderer};
