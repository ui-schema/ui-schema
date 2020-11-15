import React from 'react';
import {useRefs, ReferencingProvider} from './ReferencingProvider';
import {parseRefs} from '@ui-schema/ui-schema/Plugins/ReferencingHandler/parseRefs';
import {Trans} from '@ui-schema/ui-schema/Translate';
import {useSchemaRoot} from '@ui-schema/ui-schema/SchemaRootProvider/SchemaRootProvider';
import {useNetworkRef} from '@ui-schema/ui-schema/Plugins/ReferencingHandler/ReferencingNetworkHandler';
import {NextPluginRendererMemo} from '@ui-schema/ui-schema/PluginStack/PluginStack';

const ReferencingRenderer = (props) => {
    let {schema} = props;
    const {definitions} = useRefs();
    const {schema: rootSchema} = useSchemaRoot()
    const {getSchema, loadSchema} = useNetworkRef()

    const schemaRefPrevious = React.useRef(undefined);
    const schemaRef = React.useRef(undefined);
    let refPending = null

    if(schemaRef.current && schemaRefPrevious.current?.equals(schema)) {
        schema = schemaRef.current;
    } else {
        const parseRes = parseRefs(schema, {
            defs: definitions, schema: rootSchema,
            fetchSchema: getSchema,
        });
        refPending = parseRes.pending

        if(!refPending || refPending.size <= 0) {
            schemaRefPrevious.current = schema;
            schemaRef.current = parseRes.schema;
            schema = parseRes.schema;
        }
    }

    React.useEffect(() => {
        if(refPending && refPending.size > 0) {
            refPending.forEach((versions, id) => {
                loadSchema(id)
            })
        }
    }, [refPending])

    // todo: if this schema-level got a `$ref` in the root, it must render the schema-root provider again,
    //       this way nested refs can be resolved correctly against the, maybe, other-base url (the $id of the $ref, not from this level)

    return refPending && refPending.size > 0 ?
        <Trans text={'labels.loading'} fallback={'Loading'}/> :
        <NextPluginRendererMemo {...props} schema={schema}/>;
};

export const ReferencingHandler = (props) => {
    let {schema} = props;

    const definitions = schema.get('definitions') || schema.get('$defs')

    return <React.Fragment>
        {definitions ?
            <ReferencingProvider definitions={definitions}>
                <ReferencingRenderer {...props}/>
            </ReferencingProvider> :
            <ReferencingRenderer {...props}/>}
    </React.Fragment>;
};
