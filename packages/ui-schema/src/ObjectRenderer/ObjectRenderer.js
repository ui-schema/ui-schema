import React from 'react';
import {memo} from '../Utils/memo';
import {PluginStack} from '../PluginStack';

let ObjectRenderer = ({
                          widgets, level, schema, storeKeys, ...props
                      }) => {
    const {isVirtual} = props
    const properties = schema.get('properties');

    if(!widgets.GroupRenderer) {
        if(process.env.NODE_ENV === 'development') {
            console.error('Widget GroupRenderer not existing');
        }
        return null;
    }
    if(!properties) {
        if(process.env.NODE_ENV === 'development') {
            console.error('not rendering object, missing `properties`');
        }
        return null;
    }
    const GroupRenderer = widgets.GroupRenderer;

    const propertyTree = properties.map((childSchema, childKey) =>
        <PluginStack
            key={childKey}
            {...props}
            schema={childSchema} parentSchema={schema}
            storeKeys={storeKeys.push(childKey)} level={level + 1}
        />,
    ).valueSeq()

    // no-properties could come from
    //   e.g. combining/conditional schemas which are currently not applied (e.g. a condition fails)
    return isVirtual ? propertyTree :
        properties ? <GroupRenderer level={level} schema={schema} noGrid={props.noGrid}>
            {propertyTree}
        </GroupRenderer> : null
};
ObjectRenderer = memo(ObjectRenderer);

export {ObjectRenderer}
