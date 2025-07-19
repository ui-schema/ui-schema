/* eslint-disable @typescript-eslint/no-deprecated */
import { SomeSchema } from '@ui-schema/ui-schema/CommonTypings'
import * as React from 'react'
import { Map } from 'immutable'
import { createOrderedMap } from '@ui-schema/ui-schema/createMap'

/**
 * @deprecated will be removed in a future version
 */
export const PROGRESS_NONE = false
/**
 * @deprecated will be removed in a future version
 */
export const PROGRESS_START = 'start'
/**
 * @deprecated will be removed in a future version
 */
export const PROGRESS_DONE = true
/**
 * @deprecated will be removed in a future version
 */
export const PROGRESS_ERROR = 'error'

/**
 * @deprecated will be removed in a future version
 */
export type PROGRESS = false | 'start' | true | 'error'

/**
 * @deprecated will be removed in a future version
 */
export function useProgress(): [PROGRESS, React.Dispatch<React.SetStateAction<PROGRESS>>] {
    return React.useState(PROGRESS_NONE) as [PROGRESS, React.Dispatch<React.SetStateAction<PROGRESS>>]
}

/**
 * @deprecated will be removed in a future version
 */
export interface UIApiContextType {
    schemas?: Map<string, SomeSchema>
    loadSchema?: (url: string, versions?: string[]) => Promise<PROGRESS>
}

/**
 * @deprecated will be removed in a future version
 */
export type loadSchemaUIApi = (refUrl: string, version?: string[]) => Promise<any>

/**
 * @deprecated will be removed in a future version
 */
export type schemaLocalCachePath = string

/**
 * @deprecated will be removed in a future version
 */
export const UIApiContext = React.createContext<UIApiContextType>({})

/**
 * @deprecated will be removed in a future version
 */
export const useUIApi = (): UIApiContextType => React.useContext(UIApiContext)

/**
 * @deprecated will be removed in a future version
 */
export const schemaLocalCachePath = 'uischema-cache' + (typeof window === 'undefined' ? 0 : window.location.port)

const initialState = ({noCache = false}): Map<'schemas', Map<string, SomeSchema>> => {
    let cached
    if (!noCache) {
        const cachedRaw = window?.localStorage?.getItem(schemaLocalCachePath)
        if (cachedRaw) {
            try {
                cached = JSON.parse(cachedRaw)
            } catch (e) {
                if (process.env.NODE_ENV === 'development') {
                    console.error('invalid localStorage schema cache', e)
                }
            }
        }
    }

    return Map({schemas: (cached ? createOrderedMap(cached) : Map())})
}

/**
 * @deprecated will be removed in a future version
 */
export interface UIApiActionSchemaLoaded {
    type: 'SCHEMA_LOADED'
    id: string
    value: any
    noCache: boolean | undefined
}

function reducer(state: Map<'schemas', Map<string, SomeSchema>>, action: UIApiActionSchemaLoaded) {
    if (action.type === 'SCHEMA_LOADED') {
        return (() => {
            const tmpState = state.setIn(['schemas', action.id], createOrderedMap(action.value))
            if (!action.noCache) {
                const schemas = tmpState.get('schemas')
                if (schemas) {
                    window?.localStorage?.setItem(schemaLocalCachePath, JSON.stringify(schemas.toJS()))
                }
            }
            return tmpState
        })()
    }
    return state
}

// @todo refactor to a context based ref/cache
const schemasLoaded = {schemas: {}}

/**
 * @deprecated will be removed in a future version
 */
export const isLoaded = (schemas: UIApiContextType['schemas'], ref: string, version?: string): boolean => {
    return Boolean(
        !ref ? false : (
            ref && schemas?.get(ref) && (
                (version && schemas?.getIn([ref, 'version']) === version) ||
                schemas?.getIn([ref, 'version']) === '*' ||
                !schemas?.getIn([ref, 'version'])
            )
        ),
    )
}

/**
 * @deprecated will be removed in a future version
 */
export interface UIApiProviderProps {
    loadSchema: loadSchemaUIApi
    noCache?: boolean
}

/**
 * @deprecated will be removed in a future version
 */
export const UIApiProvider: React.FC<React.PropsWithChildren<UIApiProviderProps>> = ({loadSchema, noCache, children}) => {
    const [state, dispatch] = React.useReducer(reducer, {noCache}, initialState)

    const loadSchemaFn = React.useCallback((url) => {
        if (schemasLoaded.schemas[url] === PROGRESS_START || schemasLoaded.schemas[url] === PROGRESS_DONE)
            return Promise.resolve(schemasLoaded.schemas[url])
        schemasLoaded.schemas[url] = PROGRESS_START
        return loadSchema(url)
            .then(loadedSchema => {
                schemasLoaded.schemas[url] = PROGRESS_DONE
                dispatch({
                    type: 'SCHEMA_LOADED',
                    id: url,
                    value: loadedSchema,
                    noCache: noCache,
                })
                return PROGRESS_DONE
            })
            .catch(() => {
                schemasLoaded.schemas[url] = PROGRESS_ERROR
                return PROGRESS_ERROR
            })
    }, [loadSchema, noCache])

    const contextValue: UIApiContextType = React.useMemo(() => ({
        schemas: state.get('schemas'),
        loadSchema: loadSchemaFn,
    } as UIApiContextType), [state, loadSchemaFn])

    return <UIApiContext.Provider value={contextValue}>
        {children}
    </UIApiContext.Provider>
}
