import React from 'react';
import {ObjectRenderer} from '@ui-schema/ui-schema/ObjectRenderer';
import {List} from 'immutable';
import {UIGeneratorNested} from '@ui-schema/ui-schema/UIGeneratorNested';

const ArrayRenderer = ({storeKeys, value, schema}) =>
    value ? value.map((val, i) =>
        List.isList(schema.get('items')) ?
            schema.get('items').map((item, j) => <UIGeneratorNested
                key={j}
                storeKeys={storeKeys.push(i).push(j)}
                schema={item}
                isVirtual
            />).valueSeq() :
            <UIGeneratorNested
                storeKeys={storeKeys.push(i)}
                schema={schema.get('items')}
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
