import { SchemaPlugin } from '@ui-schema/ui-schema/SchemaPlugin'
import { WidgetPayload } from '@ui-schema/ui-schema/Widget'
import { List } from 'immutable'

/**
 * A plugin to inject the `required` prop.
 * This is not a validation plugin, only for `required` property injection.
 * @todo add support for prop injection from validator plugins? to be able to remove these?
 *       still would need better support for applied-to-child vs. applied-to-self
 */
export const requiredPlugin: SchemaPlugin<WidgetPayload> = {
    handle: ({parentSchema, storeKeys}) => {
        const requiredList = parentSchema?.get('required') as List<string> | undefined
        if (!requiredList || !List.isList(requiredList) || !storeKeys) {
            return {required: false}
        }
        const ownKey = storeKeys.last()
        return {
            required: typeof ownKey === 'string' && requiredList.contains(ownKey),
        }
    },
}
