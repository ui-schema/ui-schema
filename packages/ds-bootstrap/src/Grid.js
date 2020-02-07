import React from "react";
import {NextPluginRenderer} from "@ui-schema/ui-schema";

const SchemaGridItem = ({children}) => {
//const SchemaGridItem = ({schema, children, defaultMd}) => {
    /*const view = schema ? schema.getIn(['view']) : undefined;
    const viewXs = view ? (view.getIn(['sizeXs']) || 12) : 12;
    const viewSm = schema ? schema.getIn(['view', 'sizeSm']) : undefined;
    const viewMd = schema ? schema.getIn(['view', 'sizeMd']) : defaultMd;
    const viewLg = schema ? schema.getIn(['view', 'sizeLg']) : undefined;
    const viewXl = schema ? schema.getIn(['view', 'sizeXl']) : undefined;*/

    return <div
        className={'col-md-3'}
    >
        {children}
    </div>
};

const RootRenderer = props => <div className={'container-inner'}>{props.children}</div>;

const GroupRenderer = ({schema, children}) => <SchemaGridItem schema={schema}>
    <div className={'container'}>
        {children}
    </div>
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
