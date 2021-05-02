import * as React from 'react'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'
import { GroupRendererProps } from '@ui-schema/ui-schema/WidgetsBinding'

export interface ObjectRendererProps extends WidgetProps {
    noGrid?: GroupRendererProps['noGrid']
}

export function ObjectRenderer<P extends ObjectRendererProps>(props: P): React.ReactElement
