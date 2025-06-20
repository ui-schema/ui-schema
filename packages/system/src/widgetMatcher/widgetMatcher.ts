import { schemaTypeToDistinct } from '@ui-schema/system/schemaTypeToDistinct'
import { SchemaTypesType } from '@ui-schema/system/CommonTypings'
import { ErrorNoWidgetMatching } from '@ui-schema/system/widgetMatcher'
import { WidgetsBindingRoot } from '@ui-schema/system/WidgetsBinding'

export function widgetMatcher<TW extends {} = {}, CW extends {} = {}, W extends WidgetsBindingRoot<TW, CW> = WidgetsBindingRoot<TW, CW>>(
    {
        widgetName,
        schemaType,
        widgets,
    }: {
        widgetName: string | undefined
        schemaType: SchemaTypesType
        widgets: W
    }
): TW | CW | null {
    let Widget: TW | CW | null = null

    // getting the to-render widget based on if it finds a custom object-widget or a widget extending native-types,
    if (widgetName && widgets.custom) {
        if (widgets.custom[widgetName]) {
            Widget = widgets.custom[widgetName] as TW | CW
        } else {
            throw new ErrorNoWidgetMatching()
                .setScope('custom')
                .setMatching(widgetName)
        }
    } else if (schemaType && widgets.types) {
        const distinctInputType = schemaTypeToDistinct(schemaType)

        if (distinctInputType) {
            if (widgets.types[distinctInputType]) {
                Widget = widgets.types[distinctInputType] as TW | CW
            } else if (distinctInputType === 'null') {
                Widget = null
            } else {
                throw new ErrorNoWidgetMatching()
                    .setScope('type')
                    .setMatching(distinctInputType)
            }
        }
    }

    return Widget
}
