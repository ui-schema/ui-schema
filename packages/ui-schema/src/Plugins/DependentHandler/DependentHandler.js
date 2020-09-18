import React from 'react';
import {NextPluginRenderer, NextPluginRendererMemo} from '../../PluginStack';
import {useUI} from '../../UIStore';
import {mergeSchema} from '../../Utils/mergeSchema';
import {List, Map} from 'immutable';

const DependentRenderer = ({dependencies, dependentSchemas, dependentRequired, ...props}) => {
    let {schema, storeKeys} = props;
    const {store} = useUI();

    const currentValues = storeKeys.size ? store.getValues().getIn(storeKeys) : store.getValues();

    if(!currentValues) return <NextPluginRendererMemo {...props} schema={schema}/>;

    currentValues.keySeq().forEach(key => {
        const key_dependencies = dependencies ? dependencies.get(key) : undefined;
        const key_dependentSchemas = dependentSchemas ? dependentSchemas.get(key) : undefined;
        const key_dependentRequired = dependentRequired ? dependentRequired.get(key) : undefined;

        // todo: what if the `key`'s own schema should be dynamically changed?
        //   what to remove?
        //   what to keep? when keeping e.g. `const` it could destroy `enum`s

        // "if property is present", must not use "if correct type"
        if(typeof currentValues.get(key) !== 'undefined') {
            if(Map.isMap(key_dependencies) || Map.isMap(key_dependentSchemas)) {
                // schema-dependencies
                // value for dependency exist, so it should be used
                if(Map.isMap(key_dependencies)) {
                    schema = mergeSchema(schema, key_dependencies);
                } else {
                    schema = mergeSchema(schema, key_dependentSchemas);
                }
            }
            if(List.isList(key_dependencies) || List.isList(key_dependentRequired)) {
                // property-dependencies
                // value for dependency exist, so it should be used
                const currentRequired = schema.get('required') || List();
                if(List.isList(key_dependencies)) {
                    schema = schema.set('required', currentRequired.concat(key_dependencies));
                } else {
                    schema = schema.set('required', currentRequired.concat(key_dependentRequired));
                }
            }
        }
    });

    return <NextPluginRendererMemo {...props} schema={schema}/>;
};

export const DependentHandler = (props) => {
    let {storeKeys, ownKey, schema} = props;

    const dependencies = schema.get('dependencies');
    const dependentSchemas = schema.get('dependentSchemas');
    const dependentRequired = schema.get('dependentRequired');

    return <React.Fragment>
        {dependencies || dependentSchemas || dependentRequired ?
            <DependentRenderer
                dependencies={dependencies}
                dependentSchemas={dependentSchemas}
                dependentRequired={dependentRequired}
                storeKeys={storeKeys}
                ownKey={ownKey}
                {...props}/>
            : <NextPluginRenderer {...props}/>}
    </React.Fragment>;
};
