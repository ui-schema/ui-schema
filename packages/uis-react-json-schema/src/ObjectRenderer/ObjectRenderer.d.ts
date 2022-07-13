import * as React from 'react'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { GroupRendererProps } from '@ui-schema/react/Widgets'

export interface ObjectRendererProps extends WidgetProps {
    noGrid?: GroupRendererProps['noGrid']
}

export function ObjectRenderer<P extends ObjectRendererProps>(props: P): React.ReactElement
