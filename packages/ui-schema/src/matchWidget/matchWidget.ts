import { schemaTypeToDistinct } from '@ui-schema/ui-schema/schemaTypeToDistinct'
import { SchemaTypesType } from '@ui-schema/ui-schema/CommonTypings'
import { ErrorNoWidgetMatches } from '@ui-schema/ui-schema/matchWidget'
import { WidgetsBindingRoot } from '@ui-schema/ui-schema/WidgetsBinding'

export type WidgetMatch<TW extends {} = {}> = {
    Widget: TW
    scope: 'type' | 'custom'
    id: string
}

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
): WidgetMatch<TW> | null {
    // todo: this should be `TW[keyof TW]`, as `TW` is the `Record` level normally,
    //       but somehow this worked, even with enforcing types match between widgets/renderer/matcher (mui widgetsBinding)
    let widgetMatch: WidgetMatch<TW> | null = null

    if (widgetName) {
        if (widgets && widgets[widgetName]) {
            widgetMatch = {
                Widget: widgets[widgetName] as TW,
                id: widgetName,
                scope: 'custom',
            }
        } else {
            throw new ErrorNoWidgetMatches('custom', widgetName)
        }
    } else if (schemaType) {
        const distinctInputType = schemaTypeToDistinct(schemaType)
        if (distinctInputType) {
            if (widgets?.[distinctInputType]) {
                widgetMatch = {
                    Widget: widgets[distinctInputType] as TW,
                    id: distinctInputType,
                    scope: 'type',
                }
            } else if (distinctInputType === 'null') {
                widgetMatch = {
                    Widget: null as unknown as TW,
                    scope: 'type',
                    id: distinctInputType,
                }
            } else {
                throw new ErrorNoWidgetMatches('type', distinctInputType)
            }
        }
    }

    return widgetMatch
}
