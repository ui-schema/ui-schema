import React from 'react'
import {NextPluginRenderer} from '@ui-schema/ui-schema/PluginStack'
import {useUIApi} from '@ui-schema/ui-schema/UIApi';
import {Trans} from '@ui-schema/ui-schema/Translate/Trans/Trans';
import {isLoaded} from '@ui-schema/ui-schema/UIApi/UIApi';
import {getCleanRefUrl, getFragmentFromUrl, isRelUrl, makeUrlFromRef, useRefs} from '@ui-schema/ui-schema/Plugins/ReferencingHandler/ReferencingProvider';

const RefLoader = (props) => {
    let {schema, schemaRef} = props
    const {loadSchema, schemas} = useUIApi()
    const {id} = useRefs()

    let schemaUrl = schemaRef
    if(isRelUrl(schemaRef)) {
        schemaUrl = makeUrlFromRef(schemaRef, id)
    }

    let cleanUrl = getCleanRefUrl(schemaUrl)

    if(schemaUrl && schemas?.has(cleanUrl)) {
        let tmpSchema = schemas?.get(cleanUrl)
        const fragment = getFragmentFromUrl(schemaUrl)
        if(fragment) {
            // todo: add correct JSON Pointer parser for refs/urls with `#` in it
            tmpSchema = tmpSchema.getIn(fragment.split('/'))
        }
        schema = tmpSchema
    }
    const loaded = isLoaded(schemas, cleanUrl, schema.get('version'))

    React.useEffect(() => {
        if(loadSchema && schemaUrl && !loaded) {
            loadSchema(schemaUrl).then()
        }
        if(!loadSchema) {
            console.error('ReferencingNetworkLoader `loadSchema` not defined, maybe missing `UIApiProvider`')
        }
    }, [loadSchema, schemaUrl, loaded])

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
