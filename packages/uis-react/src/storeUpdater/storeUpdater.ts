import { scopeUpdaterInternals, scopeUpdaterValidity, scopeUpdaterValues } from '@ui-schema/react/storeScopeUpdater'
import { addNestKey, UIStoreType } from '@ui-schema/react/UIStore'
import { UIStoreAction, UIStoreActions, UIStoreUpdaterData } from '@ui-schema/react/UIStoreActions'
import { SchemaTypesType } from '@ui-schema/system/CommonTypings'
import { moveItem } from '@ui-schema/system/Utils'
import { StoreKeys } from '@ui-schema/system/ValueStore'
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
                // store.internals?.getIn(addNestKey('internals', storeKeys)) :
                // @ts-expect-error store type not finished
                store.internals?.getIn(addNestKey('children', storeKeys))?.get('self') :
                store.internals?.get('self')
    }
    if (scopes.includes('valid')) {
        data.valid =
            storeKeys.size ?
                // store.validity?.getIn(storeKeys) :
                // @ts-expect-error store type not finished
                store.validity?.getIn(addNestKey('children', storeKeys))?.get('valid') :
                store.validity?.get('valid')
    }
    if (scopes.includes('meta')) {
        data.meta = store.meta
    }
    return data as D
}

function updateScopedData<S extends UIStoreType = UIStoreType, D extends UIStoreUpdaterData = UIStoreUpdaterData>(
    store: S,
    scopes: (keyof D)[],
    storeKeys: StoreKeys,
    data: D,
    action: Pick<UIStoreAction, 'schema' | 'required'>,
): S {
    if (scopes.includes('value')) {
        store = scopeUpdaterValues(
            store,
            storeKeys,
            data.value,
            action,
        )
    }
    if (scopes.includes('internal')) {
        store = scopeUpdaterInternals(
            store,
            storeKeys,
            data.internal,
        )
    }
    if (scopes.includes('valid')) {
        store = scopeUpdaterValidity(
            store,
            storeKeys,
            data.valid,
        )
    }
    if (scopes.includes('meta')) {
        store = store.set('meta', data.meta) as typeof store
    }
    return store
}

type StoreActionHandlersMap = {
    [Type in UIStoreActions['type']]?: <S extends UIStoreType = UIStoreType>(store: S, action: Extract<UIStoreActions, { type: Type }>) => S
}

const storeActionHandlersMap: StoreActionHandlersMap = {
    'list-item-add':
        (store, action) => {
            // todo: shouldn't store.extractValues do the same?
            const data = getScopedData(store, ['value', 'internal'], action.storeKeys)
            if ('itemValue' in action) {
                data.value ||= List()
                data.value = data.value.push(action.itemValue)
            } else {
                const schema = action.schema
                const items = schema.get('items')
                const type = schema.getIn(['items', 'type']) as SchemaTypesType
                data.value ||= List()
                data.value = data.value.push(
                    // todo: multi type support #68
                    type === 'object' ? OrderedMap() :
                        // todo: handle tuple items default / `undefined of non existing keys`
                        // `List.isList(items)` means it got tuple items
                        List.isList(items) || type === 'array' ? List() :
                            type === 'string' ? '' :
                                type === 'null' ? null :
                                    undefined,
                )
            }

            // todo: support `default` keyword
            //       https://github.com/ui-schema/ui-schema/issues/143
            // value: value,
            data.internal ||= Map()
            data.internal = data.internal.update('children', (internalInternals = List()) =>
                // data.internal = data.internal.update('internals', (internalInternals = List()) =>
                internalInternals.push(Map()),
            )

            return updateScopedData(
                store,
                ['value', 'internal'],
                action.storeKeys,
                data,
                action,
            )
        },
    'list-item-delete':
        (store, action) => {
            // todo: shouldn't store.extractValues do the same?
            const data = getScopedData(store, ['value', 'internal'], action.storeKeys)
            data.value ||= List()
            data.value = data.value.splice(action.index, 1)

            data.internal ||= Map()
            data.internal = data.internal.update('children', (internalInternals = List()) =>
                // data.internal = data.internal.update('internals', (internalInternals = List()) =>
                internalInternals.splice(action.index, 1),
            )

            return updateScopedData(
                store,
                ['value', 'internal'],
                action.storeKeys,
                data,
                action,
            )
        },
    'list-item-move':
        (store, action) => {
            // todo: shouldn't store.extractValues do the same?
            const data = getScopedData(store, ['value', 'internal'], action.storeKeys)
            data.value ||= List()
            data.value = moveItem(data.value, action.fromIndex, action.toIndex)

            data.internal ||= Map()
            data.internal = data.internal.update('children', (internalInternals = List()) =>
                // data.internal = data.internal.update('internals', (internalInternals = List()) =>
                moveItem(
                    (internalInternals.size - 1) < action.toIndex ?
                        // "set undefined at target":
                        // - to fix "Cannot update within non-data-structure value in path ["values","options",0,"choices",0]: undefined"
                        // - e.g. when rendering DND with existing data where not every item uses `internals`,
                        //   the structures like [data1, data2] vs [internal1] can not be moved with splice
                        internalInternals.set(action.toIndex, undefined) :
                        (internalInternals.size - 1) < action.fromIndex ?
                            // "set undefined at target":
                            // - to fix similar issue, but now when "switching" between two, where the from ist after already existing internals
                            internalInternals.set(action.fromIndex, undefined) :
                            internalInternals,
                    action.fromIndex, action.toIndex,
                ),
            )

            return updateScopedData(
                store,
                ['value', 'internal'],
                action.storeKeys,
                data,
                action,
            )
        },
    'set':
        (store, action) => {
            return updateScopedData(
                store,
                action.scopes,
                action.storeKeys,
                action.data,
                action,
            )
        },
    'update':
        (store, action) => {
            const data = action.updater(getScopedData(store, action.scopes, action.storeKeys))

            return updateScopedData(
                store,
                action.scopes,
                action.storeKeys,
                data,
                action,
            )
        },
}

export const storeUpdater =
    <S extends UIStoreType = UIStoreType, D extends UIStoreUpdaterData = UIStoreUpdaterData, A extends UIStoreActions<S, D> = UIStoreActions<S, D>>(
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
                const actionHandler = storeActionHandlersMap[action.type]
                if (actionHandler) {
                    nextStore = actionHandler(
                        nextStore,
                        // @ts-expect-error union type not reduced by TS
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
