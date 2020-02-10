import React from "react";
import {NextPluginRenderer, NextPluginRendererMemo} from "../Schema/EditorWidgetStack";
import {validateSchemaObject} from "../Schema/ValidateSchema";
import {useSchemaData} from "../Schema/EditorStore";
import {mergeSchema} from "../Utils/mergeSchema";
import {Map} from 'immutable';

const handleIfElseThen = (schema, store, distSchema) => {
    const keyIf = schema.get('if');
    const keyThen = schema.get('then');
    const keyElse = schema.get('else');

    if(keyIf) {
        if(0 === validateSchemaObject(keyIf, store).size) {
            // no errors in schema found, `then` should be rendered
            if(keyThen) {
                distSchema = mergeSchema(distSchema, keyThen);
            }
        } else {
            // errors in schema found, `else` should be rendered
            if(keyElse) {
                distSchema = mergeSchema(distSchema, keyElse);
            }
        }
    }

    return distSchema;
};

const ConditionalRenderer = (props) => {
    let {schema, storeKeys} = props;
    const {store} = useSchemaData();

    const currentStore = storeKeys.size ? store.getIn(storeKeys) : store;

    if(!Map.isMap(currentStore)) return <NextPluginRendererMemo {...props} schema={schema}/>;

    const allOf = schema.get('allOf');
    const keyIf = schema.get('if');

    if(keyIf) {
        schema = handleIfElseThen(schema, currentStore, schema);
    } else if(allOf) {
        allOf.forEach(subSchema => {
            schema = handleIfElseThen(subSchema, currentStore, schema);
        })
    }

    return <NextPluginRendererMemo {...props} schema={schema}/>;
};

const ConditionalHandler = (props) => {
    let {schema} = props;

    const hasAllOf = schema.get('allOf');
    const hasIf = schema.get('if');

    return <React.Fragment>
        {hasAllOf || hasIf ?
            <ConditionalRenderer
                {...props}/>
            : <NextPluginRenderer {...props}/>}
    </React.Fragment>;
};

export {ConditionalHandler}
