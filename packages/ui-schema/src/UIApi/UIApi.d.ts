import React from 'react'
import { Map } from 'immutable'
import { StoreSchemaType } from '@ui-schema/ui-schema'

export const PROGRESS_NONE = false
export const PROGRESS_START = 'start'
export const PROGRESS_DONE = true
export const PROGRESS_ERROR = 'error'

export type PROGRESS = false | 'start' | true | 'error'

export function useProgress(): [PROGRESS, React.Dispatch<React.SetStateAction<PROGRESS>>]

export interface UIApiContextType {
    schemas: Map<string, StoreSchemaType>
    loadSchema: (url: string) => Promise<PROGRESS>
}

export type schemaLocalCachePath = string

export function isLoaded(schemas: UIApiContextType['schemas'], ref: string, version?: string): boolean

export type UIApiContext = React.ContextType<UIApiContextType>

export function useUIApi(): UIApiContextType

export interface UIApiProviderProps {
    loadSchema: (refUrl: string) => void
}

export function UIApiProvider<P extends React.PropsWithChildren<UIApiProviderProps>>(props: P): React.ReactElement
