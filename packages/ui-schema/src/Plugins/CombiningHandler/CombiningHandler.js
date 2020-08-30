import React from "react";
import {Map} from 'immutable';
import {NextPluginRenderer, NextPluginRendererMemo} from "../../EditorPluginStack";
import {useSchemaStore} from "../../EditorStore";
import {mergeSchema} from "../../Utils/mergeSchema";
import {handleIfElseThen} from "../ConditionalHandler";

const CombiningRenderer = (props) => {
    let {schema, storeKeys} = props;
    const {store,} = useSchemaStore();

    const currentStore = storeKeys.size ? store.getValues().getIn(storeKeys) : store.getValues();

    const allOf = schema.get('allOf');
    if(allOf) {
        allOf.forEach((subSchema) => {
            schema = mergeSchema(schema, subSchema);
            const allOf = subSchema.get('allOf');

            if(currentStore && Map.isMap(currentStore)) {
                schema = handleIfElseThen(subSchema, currentStore, schema);
            }

            if(allOf) {
                // nested allOf may appear when using complex combining-conditional schemas
                allOf.forEach((subSchema1) => {
                    schema = mergeSchema(schema, subSchema1);

                    if(currentStore && Map.isMap(currentStore)) {
                        schema = handleIfElseThen(subSchema1, currentStore, schema);
                    }
                })
            }
        });
    }

    return <NextPluginRendererMemo {...props} schema={schema}/>;
};

export const CombiningHandler = (props) => {
    let {schema} = props;

    const hasAllOf = schema.get('allOf');
    return <React.Fragment>
        {hasAllOf ?
            <CombiningRenderer {...props}/> :
            <NextPluginRenderer {...props}/>}
    </React.Fragment>;
};
