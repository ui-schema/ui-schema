import React from 'react'
import { Map } from 'immutable'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'

export const PROGRESS_NONE = false
export const PROGRESS_START = 'start'
export const PROGRESS_DONE = true
export const PROGRESS_ERROR = 'error'

export type PROGRESS = false | 'start' | true | 'error'

export function useProgress(): [PROGRESS, React.Dispatch<React.SetStateAction<PROGRESS>>]

export interface UIApiContextType {
    schemas: Map<string, UISchemaMap>
    loadSchema: (url: string, versions?: string[]) => Promise<PROGRESS>
}

export type schemaLocalCachePath = string

export function isLoaded(schemas: UIApiContextType['schemas'], ref: string, version?: string): boolean

export type UIApiContext = React.ContextType<UIApiContextType>

export function useUIApi(): UIApiContextType

// todo: rename `loadSchemaUIApi`, currently the ReferencingNetworkHandler also publishes a type `loadSchema`
export type loadSchemaUIApi = (refUrl: string, version?: string[]) => void

export interface UIApiProviderProps {
    loadSchema: loadSchemaUIApi
    noCache?: boolean
}

export function UIApiProvider<P extends React.PropsWithChildren<UIApiProviderProps>>(props: P): React.ReactElement
