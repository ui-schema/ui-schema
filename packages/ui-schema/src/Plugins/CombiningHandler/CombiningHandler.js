import React from 'react';
import {Map} from 'immutable';
import {NextPluginRenderer} from '@ui-schema/ui-schema/PluginStack';
import {mergeSchema} from '@ui-schema/ui-schema/Utils/mergeSchema';
import {handleIfElseThen} from '@ui-schema/ui-schema/Plugins/ConditionalHandler';

export const CombiningHandler = (props) => {
    let {schema, value} = props;

    const allOf = schema.get('allOf');
    if(allOf) {
        allOf.forEach((subSchema) => {
            // removing afterwards-handled keywords, otherwise they would merge wrongly/double evaluate
            schema = mergeSchema(schema, subSchema.delete('if').delete('else').delete('then').delete('allOf'));

            if(value && Map.isMap(value)) {
                schema = handleIfElseThen(subSchema, value, schema);
            }

            const allOf1 = subSchema.get('allOf');
            if(allOf1) {
                // nested allOf may appear when using complex combining-conditional schemas
                allOf1.forEach((subSchema1) => {
                    // removing afterwards-handled keywords, otherwise they would merge wrongly/double evaluate
                    // further on nested `allOf` will be resolved by render flow
                    schema = mergeSchema(schema, subSchema1.delete('if').delete('else').delete('then'));

                    if(value && Map.isMap(value)) {
                        schema = handleIfElseThen(subSchema1, value, schema);
                    }
                })
            }
        });
    }

    return <NextPluginRenderer {...props} schema={schema}/>;
};
