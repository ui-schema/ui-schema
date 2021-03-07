import React from 'react';
import {useRefs, ReferencingProvider} from './ReferencingProvider';
import {parseRefs} from '@ui-schema/ui-schema/Plugins/ReferencingHandler/parseRefs';
import {Trans} from '@ui-schema/ui-schema/Translate';
import {isRootSchema, SchemaRootProvider, useSchemaRoot} from '@ui-schema/ui-schema/SchemaRootProvider/SchemaRootProvider';
import {useNetworkRef} from '@ui-schema/ui-schema/Plugins/ReferencingHandler/ReferencingNetworkHandler';
import {NextPluginRendererMemo} from '@ui-schema/ui-schema/PluginStack/PluginStack';
import {getSchemaId} from '@ui-schema/ui-schema/Utils/getSchema';

const ReferencingRenderer = (props) => {
    let {schema, isVirtual} = props;
    const {definitions} = useRefs();
    const {schema: rootSchema} = useSchemaRoot()
    const {getSchema, loadSchema} = useNetworkRef()

    const schemaRefPrevious = React.useRef(undefined);
    const schemaRef = React.useRef(undefined);
    let refPending = null

    if(schemaRef.current && schemaRefPrevious.current?.equals(schema)) {
        schema = schemaRef.current;
    } else {
        const parseRes = parseRefs(
            schema, {
            defs: definitions,
            root: rootSchema,
            getSchema,
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
            refPending.forEach((refs, rootId) => {
                refs.forEach((versions, refId) => {
                    loadSchema(refId, rootId, versions)
                })
            })
        }
    }, [refPending])

    return refPending && refPending.size > 0 ?
        isVirtual ? null : <Trans text={'labels.loading'} fallback={'Loading'}/> :
        isRootSchema(schema) ?
            <SchemaRootProvider id={getSchemaId(schema)} schema={schema}>
                <NextPluginRendererMemo {...props} schema={schema}/>
            </SchemaRootProvider> :
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
