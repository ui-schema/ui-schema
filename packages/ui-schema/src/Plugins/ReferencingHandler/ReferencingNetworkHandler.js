import React from 'react'
import {getNextPlugin} from '@ui-schema/ui-schema/PluginStack'
import {useUIApi} from '@ui-schema/ui-schema/UIApi';
import {Trans} from '@ui-schema/ui-schema/Translate/Trans/Trans';
import {getCleanRefUrl, getFragmentFromUrl, isRelUrl, makeUrlFromRef} from '@ui-schema/ui-schema/Plugins/ReferencingHandler/ReferencingProvider';
import {useSchemaRoot} from '@ui-schema/ui-schema/SchemaRootProvider/SchemaRootProvider';
import {resolvePointer} from '@ui-schema/ui-schema/JSONPointer/resolvePointer';

const getUrls = (schemaRef, id) => {
    let schemaUrl = schemaRef
    if(isRelUrl(schemaRef)) {
        schemaUrl = makeUrlFromRef(schemaRef, id)
    }

    let cleanUrl = getCleanRefUrl(schemaUrl)
    return {cleanUrl, schemaUrl}
}

export const useNetworkRef = () => {
    const prevSchemas = React.useRef()
    const {loadSchema: loader, schemas} = useUIApi()
    const {id} = useSchemaRoot()

    const loadSchema = React.useCallback((ref, rootId = '#', versions = undefined) => {
        const {cleanUrl} = getUrls(ref, rootId === '#' ? id : rootId)
        if(loader && cleanUrl) {
            loader(cleanUrl, versions).then()
        }
        if(!loader) {
            if(process.env.NODE_ENV === 'development') {
                console.error('ReferencingNetworkLoader `loadSchema` not defined, maybe missing `UIApiProvider`')
            }
        }
    }, [id, loader])

    if(!prevSchemas.current || !prevSchemas.current.equals(schemas)) {
        prevSchemas.current = schemas
    }

    const currentSchemas = prevSchemas.current

    const getSchema = React.useCallback((ref, rootId = '#', version = undefined) => {
        const {cleanUrl, schemaUrl} = getUrls(ref, rootId === '#' ? id : rootId)
        let schema
        if(schemaUrl && currentSchemas?.has(cleanUrl)) {
            let tmpSchema = currentSchemas?.get(cleanUrl)
            const fragment = getFragmentFromUrl(schemaUrl)
            if(fragment) {
                tmpSchema = resolvePointer('#/' + fragment, tmpSchema)
                // todo: if a version is set, it only enforces the root schema currently, how must fragment references treated
            }

            if(
                typeof version === 'undefined' ||
                version === tmpSchema.get('version') ||
                version === '*'
            ) {
                schema = tmpSchema
            } else if(process.env.NODE_ENV === 'development') {
                console.log('getSchema.not-found-version', ref, rootId, version, tmpSchema.get('version'))
            }
        }
        return schema;
    }, [id, currentSchemas])

    return {getSchema, loadSchema}
}

const RefLoader = ({Plugin, currentPluginIndex, ...props}) => {
    let {schema, schemaRef, isVirtual} = props
    const {loadSchema, getSchema} = useNetworkRef()

    const schemaVersion = schema?.get('version')
    const loadedSchema = getSchema(schemaRef, undefined, schemaVersion)
    const loaded = Boolean(loadedSchema)
    if(loaded) {
        schema = loadedSchema
    }

    React.useEffect(() => {
        if(!loaded) {
            loadSchema(schemaRef, undefined, [schemaVersion])
        }
    }, [loadSchema, schemaRef, schemaVersion, loaded])

    return !loaded ?
        // todo: add `could not be loaded` info output
        isVirtual ? null : <Trans text={'labels.loading'} fallback={'Loading'}/> :
        <Plugin {...props} currentPluginIndex={currentPluginIndex} schema={schema}/>
}

export const ReferencingNetworkHandler = (props) => {
    const {schema, currentPluginIndex} = props
    const next = currentPluginIndex + 1
    const Plugin = getNextPlugin(next, props.widgets)

    const ref = schema.get('$ref')
    // network references do not begin with a hashtag
    // example in spec. for dereferencing https://json-schema.org/draft/2019-09/json-schema-core.html#rfc.section.8.2.4.6
    return ref && ref.indexOf('#') !== 0 ?
        <RefLoader {...props} Plugin={Plugin} currentPluginIndex={next} schemaRef={ref}/> :
        <Plugin {...props} currentPluginIndex={next}/>
}
