import { WidgetEnumRead, WidgetEnumReadProps } from '@ui-schema/ds-material/WidgetsRead/WidgetEnumRead'
import React from 'react'
import { WidgetProps, WithScalarValue } from '@ui-schema/ui-schema'
import { MuiWidgetBinding } from '@ui-schema/ds-material/widgetsBinding'

/**
 * @deprecated use `WidgetEnumRead` instead
 */
export const WidgetSelectRead: React.ComponentType<WidgetProps<MuiWidgetBinding> & WithScalarValue & WidgetEnumReadProps> = WidgetEnumRead
