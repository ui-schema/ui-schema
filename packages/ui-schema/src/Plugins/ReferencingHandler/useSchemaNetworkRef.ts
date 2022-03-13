import React from 'react'
import { useUIApi } from '@ui-schema/ui-schema/UIApi'
import { getCleanRefUrl, getFragmentFromUrl, isRelUrl, makeUrlFromRef } from '@ui-schema/ui-schema/Plugins/ReferencingHandler'
import { useSchemaRoot } from '@ui-schema/ui-schema/SchemaRootProvider'
import { resolvePointer } from '@ui-schema/ui-schema/JSONPointer'
import { useImmutable } from '@ui-schema/ui-schema/Utils/useImmutable'
import { StoreSchemaType } from '@ui-schema/ui-schema'
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

/**
 * @deprecated use `loadSchemaRefPlugin`, will be removed at v0.3.0
 */
export type loadSchema = loadSchemaRefPlugin

export type loadSchemaRefPlugin = (ref: string, rootId?: string, versions?: string[]) => void

/**
 * @deprecated use `loadSchemaRefPlugin`, will be removed at v0.3.0
 */
export type getSchema = getSchemaRefPlugin

export type getSchemaRefPlugin = (ref: string, rootId?: string, version?: string) => StoreSchemaType | null

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
            let tmpSchema = currentSchemas?.get(cleanUrl) as StoreSchemaType
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
/**
 * @deprecated
 */
export const useNetworkRef = useSchemaNetworkRef
