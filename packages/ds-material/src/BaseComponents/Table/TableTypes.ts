import { StoreKeys, StoreSchemaType, Translator, WidgetProps } from '@ui-schema/ui-schema'
import React from 'react'
import { List, OrderedMap } from 'immutable'

export interface TableRowProps {
    // unique id of `Table` for labelledBy generation
    uid: string
    listSize: number
    dense: boolean
    setPage: React.Dispatch<React.SetStateAction<number>>
    showRows: number
}

export interface TableRendererBaseProps {
    TableRowRenderer: React.ComponentType<WidgetProps & TableRowProps>
    TableFooter: React.ComponentType<TableFooterProps>
    TableHeader: React.ComponentType<TableHeaderProps>
}

export interface TablePaginationActionsProps {
    count: number
    page: number
    rowsPerPage: number
    onChangePage: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void
}

export interface TableHeaderProps {
    validItemSchema: boolean
    dense: boolean
    schema: StoreSchemaType
    itemsSchema: StoreSchemaType
    storeKeys: StoreKeys
    readOnly: boolean
    uid: string
}

export interface TableFooterProps {
    t: Translator
    dense?: boolean
    readOnly?: boolean
    page: number
    setPage: React.Dispatch<React.SetStateAction<number>>
    listSize: number
    listSizeCurrent: number
    rows: number
    setRows: React.Dispatch<React.SetStateAction<number>>
    onChange: WidgetProps['onChange']
    storeKeys: WidgetProps['storeKeys']
    schema: WidgetProps['schema']
    showValidity: WidgetProps['showValidity']
    valid: WidgetProps['valid']
    errors: WidgetProps['errors']
    btnSize: 'small' | 'medium'
    colSize: number
}

export type TableValue = List<List<any> | OrderedMap<string, any>>