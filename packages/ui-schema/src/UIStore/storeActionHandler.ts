import { StoreActions, UIStoreUpdaterFn } from '@ui-schema/ui-schema/UIStore/UIStore'
import { List, Map, OrderedMap } from 'immutable'
import { moveItem } from '@ui-schema/ui-schema/Utils/moveItem/moveItem'
import { SchemaTypesType } from '@ui-schema/ui-schema'

export const actionHandler: (action: StoreActions) => UIStoreUpdaterFn = (action) => {
    switch (action.type) {
        case 'list-item-add':
            return ({value = List(), internal = Map(), ...r}) => {
                const schema = action.schema
                const items = schema.get('items')
                const type = schema.getIn(['items', 'type']) as SchemaTypesType
                return ({
                    // todo: support `default` keyword
                    //       https://github.com/ui-schema/ui-schema/issues/143
                    value: value.push(
                        // todo: multi type support #68
                        type === 'object' ? OrderedMap() :
                            // todo: handle tuple items default / `undefined of unexisting keys`
                            // `List.isList(items)` means it got tuple items
                            List.isList(items) || type === 'array' ? List() :
                                type === 'string' ? '' :
                                    type === 'null' ? null :
                                        undefined
                    ),
                    internal: internal.update('internals', (internalInternals = List()) =>
                        internalInternals.push(Map())
                    ),
                    ...r,
                })
            }
        case 'list-item-delete':
            return ({value = List(), internal = Map(), ...r}) => ({
                value: value.splice(action.index, 1),
                internal: internal.update('internals', (internalInternals = List()) =>
                    internalInternals.splice(action.index, 1)
                ),
                ...r,
            })
        case 'list-item-move':
            return ({value = List(), internal = Map(), ...r}) => ({
                value: moveItem(value, action.fromIndex, action.toIndex),
                internal: internal.update('internals', (internalInternals = List()) =>
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
                        action.fromIndex, action.toIndex
                    )
                ),
                ...r,
            })
        case 'update':
            return action.updater
        default:
            // @ts-ignore
            throw new Error('store updater for type not found: ' + action.type)
    }
}
