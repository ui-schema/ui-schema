import React from 'react'
import {Map} from 'immutable'
import {createOrderedMap} from '@ui-schema/ui-schema/Utils/createMap';

export const PROGRESS_NONE = false
export const PROGRESS_START = 'start'
export const PROGRESS_DONE = true
export const PROGRESS_ERROR = 'error'

export function useProgress() {
    return React.useState(PROGRESS_NONE)
}

export const UIApiContext = React.createContext({})

export const useUIApi = () => React.useContext(UIApiContext)

export const schemaLocalCachePath = 'uischema-cache' + (typeof window === 'undefined' ? 0 : window.location.port)

const initialState = ({noCache = false}) => {
    let cached
    if(!noCache) {
        const cachedRaw = window?.localStorage?.getItem(schemaLocalCachePath)
        if(cachedRaw) {
            try {
                cached = JSON.parse(cachedRaw)
            } catch(e) {
                if(process.env.NODE_ENV === 'development') {
                    console.error('invalid localStorage schema cache', e)
                }
            }
        }
    }

    return Map({schemas: (cached ? createOrderedMap(cached) : Map())})
}

/**
 * @param {OrderedMap<string, OrderedMap<string, any>>} state
 * @param {{ type?: string, id?: string, value?: any, noCache?: boolean }} action
 * @return {OrderedMap<string, OrderedMap<string, any>>}
 */
function reducer(state, action = {}) {
    if(action.type === 'SCHEMA_LOADED') {
        return (() => {
            let tmpState = state.setIn(['schemas', action.id], createOrderedMap(action.value))
            if(!action.noCache) {
                window?.localStorage?.setItem(schemaLocalCachePath, JSON.stringify(tmpState.get('schemas').toJS()))
            }
            return tmpState
        })()
    }
    return state
}

const schemasLoaded = {schemas: {}}

// todo: check why this is not used anymore, so version-cache-invalidation doens't work
export const isLoaded = (schemas, ref, version) => {
    return !ref ? false : (
        ref && schemas?.get(ref) && (
            (version && schemas?.getIn([ref, 'version']) === version) ||
            schemas?.getIn([ref, 'version']) === '*' ||
            !schemas?.getIn([ref, 'version'])
        )
    )
}

export const UIApiProvider = ({loadSchema, noCache, children}) => {
    const [state, dispatch] = React.useReducer(reducer, {noCache}, initialState)

    const loadSchemaFn = React.useCallback((url) => {
        if(schemasLoaded.schemas[url] === PROGRESS_START || schemasLoaded.schemas[url] === PROGRESS_DONE)
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

    const contextValue = React.useMemo(() => ({
        schemas: state.get('schemas'),
        loadSchema: loadSchemaFn,
    }), [state, loadSchemaFn])

    return <UIApiContext.Provider value={contextValue}>
        {children}
    </UIApiContext.Provider>
}
