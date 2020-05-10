import * as React from 'react'
import { WidgetRendererPropsExtendedCheckValid } from '../../../../ui-schema/src/WidgetRendererProps'

export interface OptionsCheckRendererProps extends WidgetRendererPropsExtendedCheckValid {
    row: boolean
}

export function OptionsCheck<P extends OptionsCheckRendererProps>(props: P): React.Component<P>
