import React from 'react';
import {Map} from 'immutable';
import {NextPluginRenderer} from '../../PluginStack';
import {mergeSchema} from '../../Utils/mergeSchema';
import {handleIfElseThen} from '../ConditionalHandler';

const CombiningRenderer = (props) => {
    let {schema, value} = props;

    const allOf = schema.get('allOf');
    if(allOf) {
        allOf.forEach((subSchema) => {
            schema = mergeSchema(schema, subSchema);
            const allOf = subSchema.get('allOf');

            if(value && Map.isMap(value)) {
                schema = handleIfElseThen(subSchema, value, schema);
            }

            if(allOf) {
                // nested allOf may appear when using complex combining-conditional schemas
                allOf.forEach((subSchema1) => {
                    schema = mergeSchema(schema, subSchema1);

                    if(value && Map.isMap(value)) {
                        schema = handleIfElseThen(subSchema1, value, schema);
                    }
                })
            }
        });
    }

    return <NextPluginRenderer {...props} schema={schema}/>;
};

export const CombiningHandler = (props) => {
    let {schema} = props;

    const hasAllOf = schema.get('allOf');

    return hasAllOf ?
        <CombiningRenderer {...props}/> :
        <NextPluginRenderer {...props}/>
};
