import React from 'react'
import {NextPluginRenderer} from '@ui-schema/ui-schema/PluginStack'
import {useUIApi} from '@ui-schema/ui-schema/UIApi';
import {Trans} from '@ui-schema/ui-schema/Translate/Trans/Trans';
import {isLoaded} from '@ui-schema/ui-schema/UIApi/UIApi';

const RefLoader = (props) => {
    let {schema, schemaRef} = props
    const {loadSchema, schemas} = useUIApi()

    const loaded = isLoaded(schemas, schemaRef, schema.get('version'))

    if(schemaRef && schemas?.has(schemaRef)) {
        schema = schemas?.get(schemaRef)
    }

    React.useEffect(() => {
        if(loadSchema && schemaRef && !loaded) {
            loadSchema(schemaRef).then()
        }
        if(!loadSchema) {
            console.error('ReferencingNetworkLoader `loadSchema` not defined, maybe missing `UIApiProvider`')
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
