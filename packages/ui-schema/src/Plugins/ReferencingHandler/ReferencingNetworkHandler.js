import React from 'react'
import {NextPluginRenderer} from '@ui-schema/ui-schema/PluginStack'
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
    const {loadSchema: loader, schemas} = useUIApi()
    const {id} = useSchemaRoot()

    const loadSchema = (ref) => {
        const {schemaUrl} = getUrls(ref, id)
        if(loader && schemaUrl) {
            loader(schemaUrl).then()
        }
        if(!loader) {
            console.error('ReferencingNetworkLoader `loadSchema` not defined, maybe missing `UIApiProvider`')
        }
    }

    // todo: memoize, overwritable `id`
    const getSchema = (ref) => {
        const {cleanUrl, schemaUrl} = getUrls(ref, id)
        let schema
        if(schemaUrl && schemas?.has(cleanUrl)) {
            let tmpSchema = schemas?.get(cleanUrl)
            const fragment = getFragmentFromUrl(schemaUrl)
            if(fragment) {
                // todo: add correct JSON Pointer parser for refs/urls with `#` in it
                //tmpSchema = tmpSchema.getIn(fragment.split('/'))
                tmpSchema = resolvePointer('#/' + fragment, tmpSchema)
            }
            schema = tmpSchema
        }
        return schema;
    }

    return {getSchema, loadSchema}
}

const RefLoader = (props) => {
    let {schema, schemaRef} = props
    const {loadSchema, getSchema} = useNetworkRef()

    const loadedSchema = getSchema(schemaRef)
    const loaded = Boolean(loadedSchema)
    if(loaded) {
        schema = loadedSchema
    }

    React.useEffect(() => {
        if(!loaded) {
            loadSchema(schemaRef)
        }
    }, [loadSchema, schemaRef, loaded])

    return !loaded ?
        // todo: remove `fallback` with a very very small svg component
        <Trans text={'labels.loading'} fallback={'Loading'}/> :
        <NextPluginRenderer {...props} schema={schema}/>
}

export const ReferencingNetworkHandler = (props) => {
    const {schema} = props

    const ref = schema.get('$ref')
    // network references do not begin with a hashtag
    // example in spec. for dereferencing https://json-schema.org/draft/2019-09/json-schema-core.html#rfc.section.8.2.4.6
    return ref && ref.indexOf('#') !== 0 ?
        <RefLoader {...props} schemaRef={ref}/> :
        <NextPluginRenderer {...props}/>
}
