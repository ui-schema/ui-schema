import { schemaTypeToDistinct } from '@ui-schema/ui-schema/schemaTypeToDistinct'
import { SchemaTypesType } from '@ui-schema/ui-schema/CommonTypings'
import { ErrorNoWidgetMatching } from '@ui-schema/ui-schema/matchWidget'
import { WidgetsBindingRoot } from '@ui-schema/ui-schema/WidgetsBinding'

export function matchWidget<TW extends {} = {}, W extends WidgetsBindingRoot<TW> = WidgetsBindingRoot<TW>>(
    {
        widgetName,
        schemaType,
        widgets,
    }: {
        widgetName: string | undefined
        schemaType: SchemaTypesType
        widgets?: W | undefined
    },
): TW | null {
    let Widget: TW | null = null

    if (widgetName) {
        if (widgets && widgets[widgetName]) {
            Widget = widgets[widgetName] as TW
        } else {
            throw new ErrorNoWidgetMatching()
                .setScope('custom')
                .setMatching(widgetName)
        }
    } else if (schemaType) {
        const distinctInputType = schemaTypeToDistinct(schemaType)
        if (distinctInputType) {
            if (widgets?.[distinctInputType]) {
                Widget = widgets[distinctInputType] as TW
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
