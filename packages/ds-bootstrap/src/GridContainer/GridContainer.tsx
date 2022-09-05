import React from 'react'
import clsx from 'clsx'
import { WidgetEngineWrapperProps } from '@ui-schema/react/WidgetEngine'

export interface GridContainerProps {
    className?: string
}

export const GridContainer: React.FC<GridContainerProps & WidgetEngineWrapperProps> = (
    {
        className,
        children,
    },
) => {
    return <div className={clsx('row', className)}>{children}</div>
}
