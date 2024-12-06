import { SchemaPlugin } from '@ui-schema/system/SchemaPlugin'
import { WidgetPayload } from '@ui-schema/system/Widget'
import { List } from 'immutable'

/**
 * A plugin to inject the `required` prop.
 * This is not a validation plugin, only for `required` property injection.
 * @todo add support for prop injection from validator plugins? to be able to remove these?
 *       still would need better support for applied-to-child vs. applied-to-self
 */
export const requiredPlugin: SchemaPlugin<WidgetPayload> = {
    should: ({parentSchema, storeKeys}) => {
        const requiredList = parentSchema?.get('required')
        if (requiredList && List.isList(requiredList) && storeKeys) {
            const ownKey = storeKeys.last()
            return typeof ownKey === 'string' && requiredList.contains(ownKey)
        }
        return false
    },
    noHandle: () => ({required: false}),
    handle: ({schema}) => {
        if (!schema) return {}
        return {required: true}
    },
}
