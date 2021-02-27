import React from 'react';
import {ObjectRenderer} from '@ui-schema/ui-schema/ObjectRenderer';
import {List} from 'immutable';
import {PluginStack} from '@ui-schema/ui-schema/PluginStack';

const ArrayRenderer = ({storeKeys, value, schema}) =>
    value ? value.map((val, i) =>
        List.isList(schema.get('items')) ?
            schema.get('items').map((item, j) =>
                <PluginStack
                    key={i + '.' + j}
                    schema={item}
                    parentSchema={schema}
                    storeKeys={storeKeys.push(i).push(j)}
                    level={0}
                    isVirtual
                />,
            ).valueSeq() :
            <PluginStack
                key={i}
                schema={schema.get('items')}
                parentSchema={schema}
                storeKeys={storeKeys.push(i)}
                level={0}
                isVirtual
            />,
    ).valueSeq() : null;

export const VirtualWidgetRenderer = (props) => {
    const {schema, widgets, value} = props;
    const type = schema.get('type');

    let Widget = null;

    if(type && widgets.types) {
        if(type === 'object') {
            Widget = ObjectRenderer;
        } else if(type === 'array') {
            Widget = ArrayRenderer;
        }
    }

    return Widget ? <Widget {...props} value={value}/> : null;
};
