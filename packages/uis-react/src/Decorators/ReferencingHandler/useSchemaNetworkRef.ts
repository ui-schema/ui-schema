import React from 'react'
import { useUIApi } from '@ui-schema/react/UIApi'
import { getCleanRefUrl, getFragmentFromUrl, isRelUrl, makeUrlFromRef } from '@ui-schema/react/Decorators/ReferencingHandler'
import { useSchemaRoot } from '@ui-schema/react/SchemaRootProvider'
import { resolvePointer } from '@ui-schema/json-pointer/resolvePointer'
import { useImmutable } from '@ui-schema/react/Utils/useImmutable'
import { UISchemaMap } from '@ui-schema/system/Definitions'
import { Map, OrderedMap } from 'immutable'

const getUrls = (schemaRef: string, id) => {
    let schemaUrl = schemaRef
    if (isRelUrl(schemaRef)) {
        schemaUrl = makeUrlFromRef(schemaRef, id)
    }

    const cleanUrl = getCleanRefUrl(schemaUrl)
    return {
        cleanUrl: cleanUrl,
        schemaUrl: schemaUrl,
    }
}

export type loadSchemaRefPlugin = (ref: string, rootId?: string, versions?: string[]) => void

export type getSchemaRefPlugin = (ref: string, rootId?: string, version?: string) => UISchemaMap | null

export const useSchemaNetworkRef = (): {
    getSchema: getSchemaRefPlugin
    loadSchema: loadSchemaRefPlugin
} => {
    const {loadSchema: loader, schemas} = useUIApi()
    const {id} = useSchemaRoot()

    const loadSchema: loadSchemaRefPlugin = React.useCallback((ref, rootId = '#', versions = undefined) => {
        const {cleanUrl} = getUrls(ref, rootId === '#' ? id : rootId)
        if (loader && cleanUrl) {
            loader(cleanUrl, versions).then()
        }
        if (!loader) {
            if (process.env.NODE_ENV === 'development') {
                console.error('ReferencingNetworkLoader `loadSchema` not defined, maybe missing `UIApiProvider`')
            }
        }
    }, [id, loader])

    const currentSchemas = useImmutable(schemas)

    const getSchema: getSchemaRefPlugin = React.useCallback((ref, rootId = '#', version = undefined) => {
        const {cleanUrl, schemaUrl} = getUrls(ref, rootId === '#' ? id : rootId)
        let schema
        if (
            typeof cleanUrl === 'string' && schemaUrl &&
            currentSchemas?.has(cleanUrl)
        ) {
            let tmpSchema = currentSchemas?.get(cleanUrl) as UISchemaMap
            const fragment = getFragmentFromUrl(schemaUrl)
            if (fragment) {
                tmpSchema = resolvePointer('#/' + fragment, tmpSchema as Map<string, any> | OrderedMap<string, any>)
                // todo: if a version is set, it only enforces the root schema currently, how must fragment references treated
            }

            if (
                typeof version === 'undefined' ||
                version === tmpSchema.get('version') ||
                version === '*'
            ) {
                schema = tmpSchema
            } else if (process.env.NODE_ENV === 'development') {
                console.log('getSchema.not-found-version', ref, rootId, version, tmpSchema.get('version'))
            }
        }
        return schema
    }, [id, currentSchemas])

    return {getSchema, loadSchema}
}

