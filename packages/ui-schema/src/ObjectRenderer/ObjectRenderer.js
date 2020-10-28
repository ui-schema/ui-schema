import React from 'react';
import {memo} from '../Utils/memo';
import {PluginStack} from '../PluginStack';

let ObjectRenderer = ({
                          widgets, level, schema, storeKeys, ...props
                      }) => {
    const properties = schema.get('properties');

    if(!widgets.GroupRenderer) {
        console.error('Widget GroupRenderer not existing');
        return null;
    }
    const GroupRenderer = widgets.GroupRenderer;

    // no-properties could come from
    //   e.g. combining/conditional schemas which are currently not applied (e.g. a condition fails)
    return properties ? <GroupRenderer level={level} schema={schema} noGrid={props.noGrid}>
        {properties.map((childSchema, childKey) =>
            <PluginStack
                key={childKey}
                {...props}
                schema={childSchema} parentSchema={schema}
                storeKeys={storeKeys.push(childKey)} level={level + 1}
            />,
        ).valueSeq()}
    </GroupRenderer> : null
};
ObjectRenderer = memo(ObjectRenderer);

export {ObjectRenderer}
