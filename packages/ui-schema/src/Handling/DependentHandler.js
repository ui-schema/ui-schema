import React from "react";
import {NextPluginRenderer, NextPluginRendererMemo} from "../Schema/EditorWidgetStack";
import {validateSchema} from "../Schema/ValidateSchema";
import {useSchemaData} from "../Schema/EditorStore";

const DependentRenderer = ({dependencies, ...props}) => {
    let {schema} = props;
    const {store} = useSchemaData();

    // todo: use sub-store with `storeKeys/ownKey` when dependencies not in root-object

    store.keySeq().forEach(key => {
        const key_dependencies = dependencies.get(key);
        if(!key_dependencies) {
            return;
        }

        const oneOf = key_dependencies.get('oneOf');
        if(oneOf) {
            for(let nestedSchema of oneOf) {
                const ownValidation = nestedSchema.getIn(['properties', key]);
                // todo: how to behave when self value is not defined in it's own `oneOf` dependency?
                if(ownValidation) {
                    if(false === validateSchema(
                        ownValidation.set('type', schema.getIn(['properties', key, 'type'])),
                        store.get(key)
                    )) {
                        // no errors in schema found, this should be rendered now dynamically

                        // todo: what if the `key`'s own schema should be dynamically changed?
                        //   what to remove?
                        //   what to keep? when keeping e.g. `const` it could destroy `enum`s

                        nestedSchema = nestedSchema.deleteIn(['properties', key]);
                        schema = schema.set('properties', schema.get('properties').mergeDeep(nestedSchema.get('properties')));

                        if(nestedSchema.get('required')) {
                            if(schema.get('required')) {
                                schema = schema.set('required', schema.get('required').concat(nestedSchema.get('required')));
                            } else {
                                schema = schema.set('required', nestedSchema.get('required'));
                            }
                        }

                        // todo: which more keywords of the matched `nestedSchema` should be merged into the `schema`?
                    }
                }
            }
        }
    });

    return <NextPluginRendererMemo {...props} schema={schema}/>;
};

const DependentHandler = (props) => {
    //let {storeKeys, ownKey} = props;
    let {schema} = props;

    //
    // todo: scribble of dependency handling
    //

    const dependencies = schema.get('dependencies');

    return <React.Fragment>
        {dependencies ? <DependentRenderer dependencies={dependencies} {...props}/> : <NextPluginRenderer {...props}/>}
    </React.Fragment>;
};

export {DependentHandler}
