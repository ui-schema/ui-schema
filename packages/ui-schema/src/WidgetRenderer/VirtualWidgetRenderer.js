import React from 'react';
import {List} from 'immutable';
import {PluginStack} from '@ui-schema/ui-schema/PluginStack';
import {ObjectRenderer} from '@ui-schema/ui-schema/ObjectRenderer';

export const VirtualArrayRenderer = (
    {storeKeys, value, schema, virtualWidgets, widgets},
) =>
    value ? value.map((val, i) =>
        <PluginStack
            key={i}
            schema={
                List.isList(schema.get('items')) ?
                    schema.get('items').get(i)
                    : schema.get('items')
            }
            parentSchema={schema}
            storeKeys={storeKeys.push(i)}
            level={0}
            virtualWidgets={virtualWidgets}
            widgets={widgets}
            isVirtual
        />,
    ).valueSeq() : null;

export const VirtualWidgetRenderer = (props) => {
    const {
        schema, value,
        virtualWidgets = {
            'default': null,
            // `ObjectRenderer` is somehow `undefined` inside of `VirtualWidgetRenderer` when this object was defined outside of the component
            'object': ObjectRenderer,
            'array': VirtualArrayRenderer,
        },
    } = props;
    const type = schema.get('type');

    let Widget = virtualWidgets['default'];

    if(type) {
        if(type === 'object') {
            Widget = virtualWidgets['object'];
        } else if(type === 'array') {
            Widget = virtualWidgets['array'];
        }
    }

    return Widget ? <Widget {...props} value={value}/> : null;
};
