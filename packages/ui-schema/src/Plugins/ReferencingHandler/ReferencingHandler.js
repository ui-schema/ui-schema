import React from 'react';
import {Trans} from '@ui-schema/ui-schema/Translate';
import {isRootSchema, SchemaRootProvider, useSchemaRoot} from '@ui-schema/ui-schema/SchemaRootProvider';
import {parseRefs, useNetworkRef} from '@ui-schema/ui-schema/Plugins/ReferencingHandler';
import {NextPluginRendererMemo} from '@ui-schema/ui-schema/PluginStack';
import {getSchemaId} from '@ui-schema/ui-schema/Utils/getSchema';

export const ReferencingHandler = ({rootContext, ...props}) => {
    let {schema, isVirtual} = props;
    const {schema: maybeRootSchema, definitions: maybeDefinitions, ...nestedRootProps} = useSchemaRoot()
    const {getSchema, loadSchema} = useNetworkRef()
    const isRoot = isRootSchema(schema) || rootContext || schema.get('definitions') || schema.get('$defs')
    const definitions = isRoot ? schema.get('definitions') || schema.get('$defs') : maybeDefinitions

    const schemaRefPrevious = React.useRef(undefined);
    const schemaRef = React.useRef(undefined);
    let refPending = null

    if(schemaRef.current && schemaRefPrevious.current?.equals(schema)) {
        schema = schemaRef.current;
    } else {
        const parseRes = parseRefs(
            schema, {
                defs: definitions,
                root: isRoot ? schema : maybeRootSchema,
                getLoadedSchema: getSchema,
            });
        refPending = parseRes.pending

        if(!refPending || refPending.size <= 0) {
            schemaRefPrevious.current = schema;
            schemaRef.current = parseRes.schema;
            schema = parseRes.schema;
        }
    }

    React.useEffect(() => {
        if(loadSchema && refPending && refPending.size > 0) {
            refPending.forEach((refs, rootId) => {
                refs.forEach((versions, refId) => {
                    loadSchema(refId, rootId, versions)
                })
            })
        } else if(!loadSchema) {
            console.error('ReferencingHandler needs `loadSchema` function to handle network references')
        }
    }, [refPending, loadSchema])

    return refPending && refPending.size > 0 ?
        isVirtual ? null : <Trans text={'labels.loading'} fallback={'Loading'}/> :
        isRoot ?
            <SchemaRootProvider {...nestedRootProps} {...(rootContext || {})} id={getSchemaId(schema)} schema={schema} definitions={definitions}>
                <NextPluginRendererMemo {...props} schema={schema}/>
            </SchemaRootProvider> :
            <NextPluginRendererMemo {...props} schema={schema}/>;
};
