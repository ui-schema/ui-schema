import React from 'react'
import {Map} from 'immutable'
import {fromJSOrdered} from '@ui-schema/ui-schema'

export const PROGRESS_NONE = false
export const PROGRESS_START = 'start'
export const PROGRESS_DONE = true
export const PROGRESS_ERROR = 'error'

export function useProgress() {
    return React.useState(PROGRESS_NONE)
}

export const UIApiContext = React.createContext({})

export const useUIApi = () => React.useContext(UIApiContext)

export const schemaLocalCachePath = 'uischema-cache' + window.location.port

const initialState = () => {
    let cached
    const cachedRaw = window?.localStorage?.getItem(schemaLocalCachePath)
    if(cachedRaw) {
        try {
            cached = JSON.parse(cachedRaw)
        } catch(e) {
            console.error('invalid localStorage schema cache', e)
        }
    }

    return Map({schemas: (cached ? fromJSOrdered(cached) : Map())})
}

/**
 * @param {OrderedMap<string, OrderedMap<string, any>>} state
 * @param {{ type?: string, id?: string, value?: any }} action
 * @return {OrderedMap<string, OrderedMap<string, any>>}
 */
function reducer(state = initialState(), action = {}) {
    switch(action.type) {
        case 'SCHEMA_LOADED':
            return (() => {
                let tmpState = state.setIn(['schemas', action.id], fromJSOrdered(action.value))
                window?.localStorage?.setItem(schemaLocalCachePath, JSON.stringify(tmpState.get('schemas').toJS()))
                return tmpState
            })()
        default:
            return state
    }
}

const schemasLoaded = {schemas: {}}

export const isLoaded = (schemas, ref, version) => {
    return !ref ? false : (
        ref && schemas?.get(ref) && (
            (version && schemas?.getIn([ref, 'version']) === version) ||
            schemas?.getIn([ref, 'version']) === '*' ||
            !schemas?.getIn([ref, 'version'])
        )
    )
}

export const UIApiProvider = ({loadSchema, children}) => {
    const [state, dispatch] = React.useReducer(reducer, undefined, reducer)

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
                })
                return PROGRESS_DONE
            })
            .catch(() => {
                schemasLoaded.schemas[url] = PROGRESS_ERROR
                return PROGRESS_ERROR
            })
    }, [loadSchema])

    const contextValue = React.useMemo(() => ({
        schemas: state.get('schemas'),
        loadSchema: loadSchemaFn,
    }), [state, loadSchemaFn])

    return <UIApiContext.Provider value={contextValue}>
        {children}
    </UIApiContext.Provider>
}
