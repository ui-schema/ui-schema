import { List, Map, OrderedMap, Record } from 'immutable'
import { StoreKeys, prependKey, UIStoreType, shouldDeleteOnEmpty } from '@ui-schema/ui-schema/UIStore/UIStore'

export interface UpdaterData {
    value?: any
    internal?: any
    valid?: any

    [extraScope: string]: any
}

export type updaterFn = ({value, internal, valid}: UpdaterData) => UpdaterData

export type updateScope = 'value' | 'internal' | 'valid' | string

const updateStoreScope: ScopeOnChangeHandlerInternal = (store, scope, storeKeys, _oldValue, newValue, deleteOnEmpty, type) => {
    if (shouldDeleteOnEmpty(newValue, deleteOnEmpty, type)) {
        const parentStore = store.getIn(storeKeys.size ? prependKey(storeKeys.splice(storeKeys.size - 1, 1) as StoreKeys, scope) : [scope])
        // e.g. numbers in tuples must only be deleted, when it is inside an object, when inside an `list` undefined must be used for a "reset"
        // todo: support valueOnDelete and fix behaviour in Array tuples https://github.com/ui-schema/ui-schema/issues/106
        //       also tests are missing atm.
        if (List.isList(parentStore)) {
            store = store.setIn(storeKeys.size ? prependKey(storeKeys, scope) : [scope], undefined)
        } else if (Map.isMap(parentStore)) {
            store = store.deleteIn(storeKeys.size ? prependKey(storeKeys, scope) : [scope])
        }
        return store
    }

    store = store.setIn(
        storeKeys.size ? prependKey(storeKeys, scope) : [scope],
        newValue
    )
    return store
}

const getScopedValue = <S extends UIStoreType>(storeKeys: StoreKeys, scope: updateScope, store: S) => store.getIn(storeKeys.size ? prependKey(storeKeys, scope) : [scope])

export const buildScopedTree = <S extends UIStoreType>(storeKeys: StoreKeys, scope: updateScope, store: S): S => {
    const relativeList = [scope]
    storeKeys.forEach(key => {
        if (typeof key === 'undefined') return

        const value = store.getIn(relativeList)
        if (
            (
                !List.isList(value) &&
                !Map.isMap(value) &&
                // @ts-ignore
                !Record.isRecord(value)
            ) ||
            (typeof key === 'number' && !List.isList(value))
        ) {
            store = store.setIn(
                relativeList,
                typeof key === 'number' ? List() : OrderedMap()
            )
        }
        // the current iteration must have the "parents" relative storeKeys, not it's own,
        // thus doesn't do the last entry inside the tree, that one must be handled by the widget/onChange handler
        relativeList.push(key as string)
    })
    return store
}

export type ScopeOnChangeHandlerInternal = <S extends UIStoreType>(
    store: S, scope: updateScope, storeKeys: StoreKeys,
    oldValue: any, newValue: any,
    deleteOnEmpty: boolean, type?: string,
    action?: UIStoreAction
) => S

export type ScopeOnChangeHandler = <S extends UIStoreType>(
    store: S, storeKeys: StoreKeys,
    oldValue: any, newValue: any,
    deleteOnEmpty: boolean, type?: string,
    action?: UIStoreAction
) => S

export interface UIStoreAction {
    [key: string]: any
}

export interface ScopeMapType {
    [scope: string]: {
        key: string
        handler: ScopeOnChangeHandler
    }
}

const scopeMap: ScopeMapType = {
    value: {
        key: 'values',
        handler: (store, storeKeys, oldValue, newValue, deleteOnEmpty, type) => {
            /*if(storeKeys.size) {
                // check / force valid root data, either List or OrderedMap, depending on , related to:
                // - array tuple validation https://github.com/ui-schema/ui-schema/issues/106
                // - (similiar to) internals safer implementation https://github.com/ui-schema/ui-schema/issues/119

                // - fix "Cannot update within non-data-structure value in path ["values","options",0,"choices",0]: undefined"
                ---> actually this was the root issue, resulting from other bugs, thus fixed the root issues,
                     but keeping this code for the moment for maybe further debugging reasons

                const parentKeys = storeKeys.splice(storeKeys.size - 1, 1)
                const currentParentValue = store.getIn(
                    parentKeys.size ? prependKey(parentKeys, 'values') : ['values'],
                )
                const ownKey = storeKeys.last()
                console.log('values', ownKey, List.isList(currentParentValue), Map.isMap(currentParentValue), Record.isRecord(currentParentValue))
                // as it is inside something, the parent must have a value
                // enforces e.g. an already 4 level deep `values` to have the needed root type
                if(
                    (!List.isList(currentParentValue) && !Map.isMap(currentParentValue) && !Record.isRecord(currentParentValue)) ||
                    (typeof ownKey === 'number' && !List.isList(currentParentValue))
                ) {
                    store = store.setIn(
                        parentKeys.size ? prependKey(parentKeys, 'values') : ['values'],
                        typeof ownKey === 'number' ? List() : OrderedMap(),
                    )
                }
            }*/
            return updateStoreScope(
                store, 'values', storeKeys,
                oldValue, newValue,
                deleteOnEmpty, type
            )
        },
    },
    internal: {
        key: 'internals',
        handler: (store, storeKeys, oldValue, newValue, deleteOnEmpty, type) => {
            if (typeof oldValue === 'undefined') {
                // initializing the tree for correct data types
                // https://github.com/ui-schema/ui-schema/issues/119
                store = buildScopedTree(storeKeys, 'internals', store)
            }
            return updateStoreScope(
                store, 'internals', storeKeys,
                oldValue, newValue,
                deleteOnEmpty, type
            )
        },
    },
    valid: {
        key: 'validity',
        handler: (store, storeKeys, oldValue, newValue, deleteOnEmpty, type) => {
            if (typeof newValue === 'undefined') {
                store = store.deleteIn(prependKey(storeKeys.push('__valid'), 'validity'))
            } else {
                store = updateStoreScope(
                    store, 'validity', storeKeys.push('__valid'),
                    oldValue, newValue,
                    deleteOnEmpty, type
                )
            }
            return store
        },
    },
}

export const storeUpdater = (
    storeKeys: StoreKeys,
    scopes: updateScope[],
    updater: updaterFn,
    deleteOnEmpty?: boolean,
    type?: string,
    action: UIStoreAction = {}
) =>
    <T extends UIStoreType>(store: T): T => {
        const values: { [k: string]: any } = {}
        scopes.forEach(scope => {
            if (!scopeMap[scope]) {
                console.error('try to update unknown scope:', scope)
                return
            }
            values[scope] = getScopedValue(storeKeys, scopeMap[scope].key, store)
        })

        const res = updater({...values})

        scopes.forEach(scope => {
            if (!scopeMap[scope]) {
                console.error('try to update unknown scope:', scope)
                return
            }
            store = scopeMap[scope].handler(
                store, storeKeys,
                values[scope], res[scope],
                Boolean(deleteOnEmpty), type, action
            )
        })

        return store
    }
