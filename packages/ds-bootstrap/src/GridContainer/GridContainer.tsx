import React from 'react'
import clsx from 'clsx'
import { WidgetEngineWrapperProps } from '@ui-schema/react/WidgetEngine'

export interface GridContainerProps {
    className?: string
}

export const GridContainer: React.FC<GridContainerProps & Partial<WidgetEngineWrapperProps>> = (
    {
        className,
        children,
    },
) => {
    return <div className={clsx('row', 'd-flex', 'flex-wrap', 'row-gap-2', className)}>{children}</div>
}
