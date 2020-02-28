import React from "react";
import {NextPluginRenderer, NextPluginRendererMemo} from "../Schema/EditorWidgetStack";
import {validateSchemaObject} from "../Schema/ValidateSchema";
import {useSchemaStore} from "../Schema/EditorStore";
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
    const {store} = useSchemaStore();

    const currentStore = storeKeys.size ? store.getIn(storeKeys) : store;

    // when current schema does not have a type, it's a pure combining schema and it's conditionals can not be checked
    //   this can come from a state where the combining schema has not been resolved (yet)
    if(!Map.isMap(currentStore) || !schema.get('type')) return <NextPluginRendererMemo {...props} schema={schema}/>;

    const keyIf = schema.get('if');

    if(keyIf) {
        schema = handleIfElseThen(schema, currentStore, schema);
    }

    return <NextPluginRendererMemo {...props} schema={schema}/>;
};

const ConditionalHandler = (props) => {
    let {schema} = props;

    const hasIf = schema.get('if');

    return <React.Fragment>
        {hasIf ?
            <ConditionalRenderer
                {...props}/>
            : <NextPluginRenderer {...props}/>}
    </React.Fragment>;
};

export {ConditionalHandler, handleIfElseThen}
