import { scopeUpdaterInternals, scopeUpdaterInternals2, scopeUpdaterValidity, scopeUpdaterValues } from '@ui-schema/react/storeScopeUpdater'
import { addNestKey, shouldDeleteOnEmpty, UIStoreType } from '@ui-schema/react/UIStore'
import { UIStoreActions, UIStoreUpdaterData } from '@ui-schema/react/UIStoreActions'
import { SchemaTypesType } from '@ui-schema/ui-schema/CommonTypings'
import { schemaTypeIs } from '@ui-schema/ui-schema/schemaTypeIs'
import { moveItem } from '@ui-schema/ui-schema/Utils'
import { StoreKeys } from '@ui-schema/ui-schema/ValueStore'
import { List, Map, OrderedMap } from 'immutable'

function getScopedData<S extends UIStoreType = UIStoreType, D extends UIStoreUpdaterData = UIStoreUpdaterData>(
    store: S,
    scopes: (keyof D)[],
    storeKeys: StoreKeys,
): D {
    const data: D = {} as D
    if (scopes.includes('value')) {
        data.value =
            storeKeys.size ?
                store.values?.getIn(storeKeys) :
                store.values
    }
    if (scopes.includes('internal')) {
        data.internal =
            storeKeys.size ?
                getSelf(store.internals?.getIn(addNestKey('children', storeKeys)), 'self') :
                store.internals?.get('self')
    }
    if (scopes.includes('valid')) {
        data.valid =
            storeKeys.size ?
                getSelf(store.validity?.getIn(addNestKey('children', storeKeys)), 'valid') :
                store.validity?.get('valid')
    }
    if (scopes.includes('meta')) {
        data.meta = store.meta
    }
    return data as D
}

const getSelf = (value: unknown, selfKey: string = 'self') => {
    if (Map.isMap(value)) {
        return value.get(selfKey)
    }
    return undefined
}

function updateScopedData<S extends UIStoreType = UIStoreType, D extends UIStoreUpdaterData = UIStoreUpdaterData>(
    store: S,
    scopes: (keyof D)[],
    storeKeys: StoreKeys,
    data: D,
    op: 'set' | 'delete',
): S {
    if (scopes.includes('value')) {
        store = scopeUpdaterValues(store, storeKeys, data.value, op)
    }
    if (scopes.includes('internal')) {
        store = scopeUpdaterInternals(store, storeKeys, data.internal, op)
    }
    if (scopes.includes('valid')) {
        store = scopeUpdaterValidity(store, storeKeys, data.valid, op)
    }
    if (scopes.includes('meta')) {
        store = store.set('meta', data.meta) as unknown as typeof store
    }
    return store
}

type StoreActionHandlersMap<S extends UIStoreType = UIStoreType, D extends UIStoreUpdaterData = UIStoreUpdaterData, TActions extends UIStoreActions<S, D> = UIStoreActions<S, D>> = {
    [Type in TActions['type']]?: (store: S, action: Extract<TActions, { type: Type }>) => S
}

const shouldDelete = (value: unknown, action) => {
    return shouldDeleteOnEmpty(value, action?.schema?.get('deleteOnEmpty') as boolean || action?.required, action?.schema?.get('type') as SchemaTypesType)
}

const storeActionHandlersMap: StoreActionHandlersMap = {
    'list-item-add':
        (store, action) => {
            const data = getScopedData(store, ['value'], action.storeKeys)
            if ('itemValue' in action) {
                data.value ||= List()
                data.value = data.value.push(action.itemValue)
            } else {
                const schema = action.schema
                const items = schema?.get('items')
                const type = schema?.getIn(['items', 'type']) as SchemaTypesType

                // todo: improve support for `default` keyword
                //       https://github.com/ui-schema/ui-schema/issues/143
                // value: value,
                const itemDefault = schema?.getIn(['items', 'default'])
                data.value ||= List()
                data.value = data.value.push(
                    typeof itemDefault !== 'undefined' ? itemDefault :
                        schemaTypeIs(type, 'object') ? OrderedMap() :
                            // todo: handle tuple items default / `undefined of non existing keys`
                            // `List.isList(items)` means it got tuple items
                            List.isList(items) || schemaTypeIs(type, 'array') ? List() :
                                schemaTypeIs(type, 'string') ? '' :
                                    // todo: respect min/max and steps, to prevent UIs from being impossible to correct,
                                    //       until then a wrong-type should be safer?
                                    // schemaTypeIs(type, 'number') ? 0 :
                                    schemaTypeIs(type, 'number') ? '' :
                                        schemaTypeIs(type, 'boolean') ? false : null,
                    // type === 'null' ? null :
                    //     undefined,
                )
            }

            store = scopeUpdaterValues(store, action.storeKeys, data.value, 'set')

            // a list item always needs to be initialized
            // todo: unify behaviour with DefaultHandler via code or like atm, via expected standard
            store = scopeUpdaterInternals2(
                store, action.storeKeys, 'set',
                (internal) => {
                    return (internal || Map()).update('children', (internalInternals = List()) => {
                        return internalInternals.set(data.value.size - 1, Map({
                            self: Map({defaultHandled: true}),
                        }))
                    })
                },
            )

            return store
        },
    'list-item-delete':
        (store, action) => {
            const data = getScopedData(store, ['value'], action.storeKeys)
            data.value ||= List()
            data.value = data.value.splice(action.index, 1)

            // always deleting the item, never the list
            store = scopeUpdaterInternals2(
                store, action.storeKeys, 'delete',
                (internal) => internal?.update('children', (internalInternals = List()) =>
                    internalInternals.splice(action.index, 1),
                ),
            )

            if (shouldDelete(data.value, action)) {
                store = scopeUpdaterValues(store, action.storeKeys, data.value, 'delete')
                return store
            }

            store = scopeUpdaterValues(store, action.storeKeys, data.value, 'set')
            return store
        },
    'list-item-move':
        (store, action) => {
            const data = getScopedData(store, ['value'], action.storeKeys)
            data.value ||= List()
            data.value = moveItem(data.value, action.fromIndex, action.toIndex)

            store = scopeUpdaterValues(store, action.storeKeys, data.value, 'set')
            store = scopeUpdaterInternals2(
                store, action.storeKeys,
                'set',
                (value = Map()) => {
                    return (value || Map()).update('children', (internalInternals = List()) =>
                        moveItem(
                            (internalInternals.size - 1) < action.toIndex ?
                                // "set undefined at target":
                                // - to fix "Cannot update within non-data-structure value in path ["values","options",0,"choices",0]: undefined"
                                // - e.g. when rendering DND with existing data where not every item uses `internals`,
                                //   the structures like [data1, data2] vs [internal1] can not be moved with splice
                                internalInternals.set(action.toIndex, undefined) :
                                (internalInternals.size - 1) < action.fromIndex ?
                                    // "set undefined at target":
                                    // - to fix similar issue, but now when "switching" between two, where the from is after already existing internals
                                    internalInternals.set(action.fromIndex, undefined) :
                                    internalInternals,
                            action.fromIndex, action.toIndex,
                        ),
                    )
                },
            )

            return store
        },
    'set':
        (store, action) => {
            if (action.scopes?.includes('value') && shouldDelete(action.data.value, action)) {
                store = scopeUpdaterValues(store, action.storeKeys, undefined, 'delete')
                return updateScopedData(
                    store,
                    action.scopes?.filter(s => s !== 'value'),
                    action.storeKeys,
                    action.data,
                    'set',
                )
            }

            // todo: improve deletion utils, add support for internals (new), valid (supported via scope-updater)

            return updateScopedData(
                store,
                action.scopes,
                action.storeKeys,
                action.data,
                // todo: set|delete depends on value per scope
                'set',
            )
        },
    'update':
        (store, action) => {

            const data = action.updater(getScopedData(store, action.scopes, action.storeKeys))

            if (action.scopes?.includes('value') && shouldDelete(data.value, action)) {
                store = scopeUpdaterValues(store, action.storeKeys, undefined, 'delete')
                return updateScopedData(
                    store,
                    action.scopes?.filter(s => s !== 'value'),
                    action.storeKeys,
                    data,
                    'set',
                )
            }

            // todo: improve deletion utils, add support for internals (new), valid (supported via scope-updater)

            return updateScopedData(
                store,
                action.scopes,
                action.storeKeys,
                data,
                // todo: set|delete depends on value per scope
                'set',
            )
        },
    // delete, but only for properties, not for items, there list-item-delete must be used for the time being.
    // this supports deleting ~~specific scopes~~ `value` or `internal`, or both, while in arrays it must always be the whole item
    'delete':
        (store, action) => {
            if (!action.storeKeys.size) {
                throw new Error('Can not delete root value.')
            }

            const data = getScopedData(store, ['value'], action.storeKeys.slice(0, -1))

            if (typeof data.value === 'undefined') {
                return store
            }

            if (!Map.isMap(data.value)) {
                throw new Error('Can only delete in object values.')
            }

            if (!action.scopes || action.scopes?.includes('value')) {
                store = scopeUpdaterValues(store, action.storeKeys, undefined, 'delete')
            }
            if (!action.scopes || action.scopes?.includes('internal')) {
                store = scopeUpdaterInternals(store, action.storeKeys, Map(), 'delete')
                // store = scopeUpdaterInternals(store, action.storeKeys, data?.internal?.set('self', Map()), 'delete')
            }
            if (!action.scopes || action.scopes?.includes('valid')) {
                // todo: and this isn't flexible enough, should it be a "delete all, except `children`"? what when wanting to delete whole node?
                // store = scopeUpdaterValidity(store, action.storeKeys, data?.valid?.delete('valid'), 'delete')
                store = scopeUpdaterValidity(store, action.storeKeys, undefined, 'delete')
            }

            return store
        },
}

/**
 * @todo simplify generics, can be done after the deprecated `effects` option is removed from actions in a future version
 */
export const createActionsReducer =
    <S extends UIStoreType = UIStoreType, D extends UIStoreUpdaterData = UIStoreUpdaterData, A extends UIStoreActions<S, D> = UIStoreActions<S, D>>(handlersMap: StoreActionHandlersMap<S, D, A>) =>
        (
            actions: A[] | A,
        ) => {
            let actionsList: A[]
            if (Array.isArray(actions)) {
                actionsList = actions
            } else {
                actionsList = [actions]
            }
            return (oldStore: S): S => {
                return actionsList.reduce((nextStore, action) => {
                    const actionHandler = handlersMap[action.type]
                    if (actionHandler) {
                        nextStore = actionHandler(
                            nextStore,
                            action,
                        )
                        // eslint-disable-next-line @typescript-eslint/no-deprecated
                        if (action.effect) {
                            // eslint-disable-next-line @typescript-eslint/no-deprecated
                            action.effect(
                                // todo: now it is no longer possible to know what was changed, only pass down store for simplicity here?
                                //       would require using e.g. extractValues where effect is used;
                                //       maybe add such meta data onto the `storeActionHandlersMap`, to be easily extendable and inferable
                                getScopedData(nextStore, ['value', 'internal', 'valid', 'meta'], action.storeKeys),
                                nextStore,
                            )
                        }
                    } else {
                        console.log('store updater for type not found: ' + ('type' in action ? action.type : 'missing type'), action)
                        // throw new Error('store updater for type not found: ' + ('type' in action ? action.type : 'missing type'))
                    }
                    return nextStore
                }, oldStore)
            }
        }

export const storeUpdater = createActionsReducer(storeActionHandlersMap)
