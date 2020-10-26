import React from 'react';
import {List, Map} from 'immutable';
import {NextPluginRenderer} from '@ui-schema/ui-schema/PluginStack';

const DefinitionsContext = React.createContext(undefined);

const handleReference = (ref, schema, definitions) => {
    if(ref.indexOf('#/definitions/') === 0 || ref.indexOf('#/$defs/') === 0) {
        const refId = ref.replace(/^#\/definitions\//, '').replace(/^#\/\$defs\//, '');
        if(!definitions) {
            console.error('definitions needed for $ref resolution', ref)
        } else if(definitions.get(refId)) {
            schema = definitions.get(refId);
        } else {
            console.error('definition not found for $ref', ref, refId)
        }
    } else if(ref.indexOf('#') === 0) {
        const def = definitions.find(def => {
            return (
                // till draft-06, no `$`, hashtag in id
                def.get('id') === ref ||
                // till draft-07, hashtag in id
                def.get('$id') === ref ||
                // from 2019-09, fragment in anchor, without leading hashtag
                def.get('$anchor') === ref.substr(1)
            )
        })

        if(def) {
            schema = def
        } else {
            console.error('definition not found for $ref', ref)
        }
    } else {
        // see $ref with urls in the ReferencingNetworkHandler plugin
        // relative non-$defs / JSON-pointer
        // $recursiveRef
        // $recursiveAnchor
    }

    return schema
}

const parseSchemaReferences = (schema, definitions, doRecursive = 0) => {
    const ref = schema.get('$ref')
    if(ref) {
        schema = handleReference(ref, schema, definitions)
    }

    const items = schema.get('items')
    if(items) {
        // array
        if(Map.isMap(items)) {
            schema = schema.set('items', parseSchemaReferences(items, definitions, doRecursive - 1));
        } else if(List.isList(items)) {
            schema = schema.set('items', items.map(subSchema =>
                parseSchemaReferences(subSchema, definitions, doRecursive - 1),
            ))
        }
    }

    const allOf = schema.get('allOf')
    if(allOf) {
        // object
        schema = schema.set('allOf', allOf.map(subSchema =>
            parseSchemaReferences(subSchema, definitions),
        ))
    }

    const properties = schema.get('properties')
    if(properties && Map.isMap(properties)) {
        schema = schema.set('properties', properties.map((subSchema) =>
            doRecursive > 0 ? parseSchemaReferences(subSchema, definitions, doRecursive - 1) : subSchema,
        ));
    }

    const if_ = schema.get('if')
    if(if_) {
        schema = schema.set('if', parseSchemaReferences(if_, definitions, 3));
    }
    const then_ = schema.get('then')
    if(then_) {
        schema = schema.set('then', parseSchemaReferences(then_, definitions, 1));
    }
    const else_ = schema.get('else')
    if(else_) {
        schema = schema.set('else', parseSchemaReferences(else_, definitions, 1));
    }
    const not_ = schema.get('not')
    if(not_) {
        schema = schema.set('not', parseSchemaReferences(not_, definitions, 3));
    }
    const contains = schema.get('contains')
    if(contains) {
        schema = schema.set('contains', parseSchemaReferences(contains, definitions, 2));
    }

    return schema;
}

const ReferencingRenderer = (props) => {
    let {schema} = props;
    const definitions = React.useContext(DefinitionsContext);

    const schemaRefPrev = React.useRef(undefined);
    const schemaRef = React.useRef(undefined);

    if(schemaRef.current && schemaRefPrev.current && schemaRefPrev.current.equals(schema)) {
        schema = schemaRef.current;
    } else {
        schemaRefPrev.current = schema;
        schema = parseSchemaReferences(schema, definitions);
        schemaRef.current = schema;
    }

    return <NextPluginRenderer {...props} schema={schema}/>;
};

export const ReferencingHandler = (props) => {
    let {schema} = props;

    const definitions = schema.get('definitions') || schema.get('$defs')

    return <React.Fragment>
        {definitions ?
            <DefinitionsContext.Provider value={definitions}>
                <ReferencingRenderer {...props}/>
            </DefinitionsContext.Provider> :
            <ReferencingRenderer {...props}/>}
    </React.Fragment>;
};
