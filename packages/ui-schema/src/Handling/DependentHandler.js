import React from "react";
import {NextPluginRenderer} from "../Schema/EditorWidgetStack";
import {validateSchema} from "../Schema/ValidateSchema";
import {NestedSchemaEditor} from "../Schema/Editor";

/*
 dependant handler:
 one component that checks if the schema has a dependant
 - if it has: call another component that uses the hook (and is a PureComponent)
 - not: call the next-plugin
 thus only widget scopes where a dependent is existing will have a logic-only re-render (when dependant state changed, big re-render)
 */
const DependentHandler = (props) => {
    const {
        dependencies, value, storeKeys, ownKey, schema, level,
    } = props;

    //
    // todo first scribble of dependency handling
    //

    let nestedSchema = undefined;
    if(dependencies) {
        const oneOf = dependencies.get('oneOf');
        if(oneOf) {
            for(let val of oneOf) {
                const ownValidation = val.getIn(['properties', ownKey]);
                // todo: how to behave when self value is not defined in it's own `oneOf` dependency?
                if(ownValidation) {
                    if(false === validateSchema(ownValidation.set('type', schema.get('type')), value)) {
                        // no errors in schema found, this should be rendered now dynamically
                        nestedSchema = val.deleteIn(['properties', ownKey]);
                    }
                }
            }
        }
    }

    // nestedSchema should use `object` and `widget` of current, or all but dependencies?
    return <React.Fragment>
        <NextPluginRenderer {...props}/>
        {nestedSchema ? <NestedSchemaEditor
            schema={nestedSchema.set('type', 'object')}
            storeKeys={storeKeys.slice(0, storeKeys.size - 1)}
            level={level + 1}
        /> : null}
    </React.Fragment>;
};

export {DependentHandler}
