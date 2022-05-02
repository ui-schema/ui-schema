import React from 'react'
import { getDisplayName, WidgetProps } from '@ui-schema/ui-schema'

export interface TableContextType {
    valid: WidgetProps['valid']
    errors: WidgetProps['errors']
}

// @ts-ignore
export const TableContext = React.createContext<TableContextType>({})

export function withTable<P extends {}>(Component: React.ComponentType<P & TableContextType>): React.ComponentType<P> {
    const WithTable = (p: P) => {

        const {errors, valid} = useTable()
        return <Component valid={valid} errors={errors} {...p}/>
    }
    WithTable.displayName = `WithTable(${getDisplayName(Component)})`
    return WithTable
}

export const useTable = (): TableContextType => React.useContext<TableContextType>(TableContext)
