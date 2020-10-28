import React from 'react'
import { OrderedMap } from 'immutable'

export interface ReferencingContext {
    id: string
    definitions?: OrderedMap<string, any>
}

export function ReferencingProvider({id, definitions}: React.PropsWithChildren<ReferencingContext>)

export function useRefs(): ReferencingContext

export function isRelUrl(schemaRef): boolean

export function getCleanRefUrl(schemaUrl): string

export function getFragmentFromUrl(url): string

export function makeUrlFromRef(schemaRef, id): string
