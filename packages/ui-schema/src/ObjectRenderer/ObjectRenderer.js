import React from 'react';
import {memo} from '@ui-schema/ui-schema/Utils/memo';
import {PluginStack} from '@ui-schema/ui-schema/PluginStack';

let ObjectRenderer = ({
                          level, schema, storeKeys,
                          // todo: concept in validation
                          // for performance reasons, not pushing errors deeper
                          // eslint-disable-next-line no-unused-vars
                          errors,
                          ...props
                      }) => {
    const {isVirtual, widgets} = props
    const properties = schema.get('properties');

    if(!isVirtual && !widgets.GroupRenderer) {
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
