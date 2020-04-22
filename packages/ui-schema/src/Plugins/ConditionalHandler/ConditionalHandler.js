import React from "react";
import {Map} from 'immutable';
import {NextPluginRenderer, NextPluginRendererMemo} from "../../EditorPluginStack";
import {useSchemaStore} from "../../EditorStore";
import {handleIfElseThen} from "./handleIfElseThen";

const ConditionalRenderer = (props) => {
    let {schema, storeKeys} = props;
    const {store} = useSchemaStore();

    const currentStore = storeKeys.size ? store.getValues().getIn(storeKeys) : store.getValues();

    // when current schema does not have a type, it's a pure combining schema and it's conditionals can not be checked
    //   this can come from a state where the combining schema has not been resolved (yet)
    if(!Map.isMap(currentStore) || !schema.get('type')) return <NextPluginRendererMemo {...props} schema={schema}/>;

    const keyIf = schema.get('if');

    if(keyIf) {
        schema = handleIfElseThen(schema, currentStore, schema);
    }

    return <NextPluginRendererMemo {...props} schema={schema}/>;
};

export const ConditionalHandler = (props) => {
    let {schema} = props;

    const hasIf = schema.get('if');

    return <React.Fragment>
        {hasIf ?
            <ConditionalRenderer
                {...props}/>
            : <NextPluginRenderer {...props}/>}
    </React.Fragment>;
};
