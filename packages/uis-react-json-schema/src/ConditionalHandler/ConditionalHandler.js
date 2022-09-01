import React from 'react';
import {NextPluginRendererMemo} from '@ui-schema/react/WidgetEngine';
import {handleIfElseThen} from './handleIfElseThen';

export const ConditionalHandler = (props) => {
    let {schema, value} = props;

    const keyIf = schema.get('if');

    if(keyIf) {
        schema = handleIfElseThen(schema, value, schema);
    }

    return <NextPluginRendererMemo {...props} schema={schema}/>;
};
