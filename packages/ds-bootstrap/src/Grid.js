import React from "react";
import {NextPluginRenderer} from "@ui-schema/ui-schema";

const SchemaGridItem = ({children, schema}) => {
    let classNameString = 'col-md';
    const view = schema ? schema.getIn(['view']) : undefined;
    if(view.getIn(['sizeXs'])) {
        classNameString = 'col';
    } else if(schema.getIn(['view', 'sizeSm'])) {
        classNameString = 'col-sm';
    } else if(schema.getIn(['view', 'sizeLg'])) {
        classNameString = 'col-lg';
    } else if(schema.getIn(['view', 'sizeXl'])) {
        classNameString = 'col-xl';
    }


    return <div
        className={[classNameString, 'container'].join(' ')}
    >
        {children}
    </div>
};

const RootRenderer = props => <div className={'container-inner'}>{props.children}</div>;

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
