import { schemaTypeToDistinct } from '@ui-schema/system/schemaTypeToDistinct'
import { SchemaTypesType } from '@ui-schema/system/CommonTypings'
import { WidgetType } from '@ui-schema/react/Widgets'
import { ErrorNoWidgetMatching } from '@ui-schema/system/widgetMatcher/ErrorNoWidgetMatching'
import { WidgetBindingRoot } from '@ui-schema/system/WidgetBinding'

export function widgetMatcher<W extends WidgetBindingRoot>(
    {
        widgetName,
        schemaType,
        widgets,
    }: {
        widgetName: string | undefined
        schemaType: SchemaTypesType
        widgets: W
    }
): WidgetType<{}, W> | null {
    let Widget: WidgetType<{}, W> | null = null

    // getting the to-render component based on if it finds a custom object-widget or a widget extending native-types,
    if (widgetName && widgets.custom) {
        if (widgets.custom[widgetName]) {
            Widget = widgets.custom[widgetName] as WidgetType<{}, W>
        } else {
            // eslint-disable-next-line react/display-name
            // Widget = () => <NoW scope={'custom'} matching={widgetName}/>
            throw new ErrorNoWidgetMatching()
                .setScope('custom')
                .setMatching(widgetName)
        }
    } else if (schemaType && widgets.types) {
        const distinctInputType = schemaTypeToDistinct(schemaType)

        if (distinctInputType) {
            if (widgets.types[distinctInputType]) {
                Widget = widgets.types[distinctInputType] as WidgetType<{}, W>
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
