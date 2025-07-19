import * as React from 'react'

export interface DndBlock {
    type: string
    typeKey: string
    idKey: string
    listKey?: string
    isDroppable?: boolean
    schema: any

    [k: string]: any
}

export interface DragDropProviderProps {
    children?: React.ReactNode
    blocks: DndBlock[]
}

export interface DragDropBlockContextType {
    blocks: {
        [k: string]: DndBlock
    }
}

// @ts-ignore
export const DragDropBlockContext = React.createContext<DragDropBlockContextType>({})

export const useBlocks = () => React.useContext(DragDropBlockContext)

export const DragDropBlockProvider: React.ComponentType<DragDropProviderProps> = (
    {
        blocks,
        children,
    }
) => {
    const ctx = React.useMemo(() => ({
        blocks: blocks.reduce((allBlocks, block) => ({...allBlocks, [block.type]: block}), {}),
    }), [
        blocks,
    ])

    return <DragDropBlockContext.Provider value={ctx}>
        {children}
    </DragDropBlockContext.Provider>
}
