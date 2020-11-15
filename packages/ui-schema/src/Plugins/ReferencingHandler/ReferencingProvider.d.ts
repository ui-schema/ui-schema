import React from 'react'
import { OrderedMap } from 'immutable'
import { StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'

export interface ReferencingContext {
    definitions?: OrderedMap<string, StoreSchemaType>
}

export function ReferencingProvider({id, definitions}: React.PropsWithChildren<ReferencingContext>)

export function useRefs(): ReferencingContext

export function isRelUrl(schemaRef): boolean

export function getCleanRefUrl(schemaUrl): string

export function getFragmentFromUrl(url): string

export function makeUrlFromRef(schemaRef, id): string
