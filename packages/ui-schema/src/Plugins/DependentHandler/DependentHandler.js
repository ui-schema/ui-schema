import React from "react";
import {NextPluginRenderer, NextPluginRendererMemo} from "../../EditorPluginStack";
import {validateSchema} from "../../Validation/validateSchema";
import {useSchemaStore} from "../../EditorStore";
import {checkValueExists} from "../../Validators/RequiredValidator";
import {mergeSchema} from "../../Utils/mergeSchema";
import {Map} from 'immutable';

const DependentRenderer = ({dependencies, dependentSchemas, ...props}) => {
    let {schema, storeKeys} = props;
    const {store} = useSchemaStore();

    const currentStore = storeKeys.size ? store.getValues().getIn(storeKeys) : store.getValues();

    if(!currentStore) return <NextPluginRendererMemo {...props} schema={schema}/>;

    currentStore.keySeq().forEach(key => {
        const key_dependencies = dependencies ? dependencies.get(key) : undefined;
        const key_dependentSchemas = dependentSchemas ? dependentSchemas.get(key) : undefined;

        // todo: what if the `key`'s own schema should be dynamically changed?
        //   what to remove?
        //   what to keep? when keeping e.g. `const` it could destroy `enum`s

        if(key_dependencies && key_dependencies.get('oneOf')) {
            const oneOf = key_dependencies.get('oneOf');
            for(let nestedSchema of oneOf) {
                const ownValidation = nestedSchema.getIn(['properties', key]);

                // todo: how to behave when self value is not defined in it's own `oneOf` dependency?
                if(ownValidation) {
                    if(false === validateSchema(
                        ownValidation.set('type', schema.getIn(['properties', key, 'type'])),
                        currentStore.get(key)
                    )) {
                        // no errors in schema found, this should be rendered now dynamically

                        nestedSchema = nestedSchema.deleteIn(['properties', key]);
                        schema = mergeSchema(schema, nestedSchema);
                    }
                }
            }
        } else if(Map.isMap(key_dependencies) || Map.isMap(key_dependentSchemas)) {
            // schema-dependencies
            if(checkValueExists(schema.getIn(['properties', key, 'type']), currentStore.get(key))) {
                // value for dependency exist, so it should be used
                if(Map.isMap(key_dependencies)) {
                    schema = mergeSchema(schema, key_dependencies);
                } else {
                    schema = mergeSchema(schema, key_dependentSchemas);
                }
            }
        } else {
            // property-dependencies

            // todo: not implemented, should be handled as dynamic "is-not-empty then required"
        }
    });

    return <NextPluginRendererMemo {...props} schema={schema}/>;
};

const DependentHandler = (props) => {
    let {storeKeys, ownKey, schema} = props;

    const dependencies = schema.get('dependencies');
    const dependentSchemas = schema.get('dependentSchemas');

    return <React.Fragment>
        {dependencies || dependentSchemas ?
            <DependentRenderer
                dependencies={dependencies}
                dependentSchemas={dependentSchemas}
                storeKeys={storeKeys}
                ownKey={ownKey}
                {...props}/>
            : <NextPluginRenderer {...props}/>}
    </React.Fragment>;
};

export {DependentHandler}
