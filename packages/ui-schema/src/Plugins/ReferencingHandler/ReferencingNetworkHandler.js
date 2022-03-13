import React from 'react'
import {getNextPlugin} from '@ui-schema/ui-schema/PluginStack'
import {Trans} from '@ui-schema/ui-schema/Translate/Trans';
import {useSchemaNetworkRef} from '@ui-schema/ui-schema/Plugins/ReferencingHandler';

const RefLoader = ({Plugin, currentPluginIndex, ...props}) => {
    let {schema, schemaRef, isVirtual} = props
    const {loadSchema, getSchema} = useSchemaNetworkRef()

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
