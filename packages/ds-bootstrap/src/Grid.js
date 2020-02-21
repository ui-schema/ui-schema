import React from "react";
import {NextPluginRenderer} from "@ui-schema/ui-schema";

const SchemaGridItem = ({children, schema}) => {
    let classNameArray = [];
    const view = schema ? schema.getIn(['view']) : undefined;
    classNameArray.push('col-xs-12');
    if(view && view.get('sizeXs')) {
        classNameArray.push('col-xs-' + view.get('sizeXs'));
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

const RootRenderer = props => <React.Fragment>{props.children}</React.Fragment>;

const GroupRenderer = ({children}) => <div className={'row'}>
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
