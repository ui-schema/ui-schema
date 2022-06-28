import { WidgetOptionsRead, WidgetOptionsReadProps } from '@ui-schema/ds-material/WidgetsRead/WidgetOptionsRead'
import React from 'react'
import { WidgetProps, WithScalarValue } from '@ui-schema/ui-schema'
import { MuiWidgetBinding } from '@ui-schema/ds-material/widgetsBinding'

/**
 * @deprecated use `WidgetOptionsRead` instead
 */
export const WidgetSelectRead: React.ComponentType<WidgetProps<MuiWidgetBinding> & WithScalarValue & WidgetOptionsReadProps> = WidgetOptionsRead
