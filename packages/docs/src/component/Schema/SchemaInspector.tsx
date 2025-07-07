import { WidgetMatch } from '@ui-schema/ui-schema/matchWidget'
import { StoreKeys } from '@ui-schema/ui-schema/ValueStore'
import { createContext, PropsWithChildren, useContext, useMemo } from 'react'

export interface SchemaInspectorLocation {
    storeKeys: StoreKeys
    schema: unknown
    WidgetOverride?: unknown
    matchedWidget?: WidgetMatch<any> | Error | null
    element: HTMLElement
}

interface SchemaInspectorContextType {
    onOpen?: (location: SchemaInspectorLocation) => void
    openStoreKeys?: StoreKeys
}

const SchemaInspectorContext = createContext<SchemaInspectorContextType>({})
export const SchemaInspectorProvider = (
    {
        children,
        onOpen,
        openStoreKeys,
    }: PropsWithChildren & SchemaInspectorContextType,
) => {
    const ctx = useMemo(() => ({
        onOpen,
        openStoreKeys,
    }), [onOpen, openStoreKeys])
    return <SchemaInspectorContext.Provider value={ctx}>
        {children}
    </SchemaInspectorContext.Provider>
}

export const useSchemaInspector = (): SchemaInspectorContextType => useContext<SchemaInspectorContextType>(SchemaInspectorContext)
