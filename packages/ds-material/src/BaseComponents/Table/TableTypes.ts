import { onChangeHandler, StoreKeys, StoreSchemaType, Translator, WidgetProps, WithValue } from '@ui-schema/ui-schema'
import React from 'react'
import { List, OrderedMap } from 'immutable'
import { ListButtonOverwrites } from '@ui-schema/ds-material/Component'

export interface TableRowProps {
    // unique id of `Table` for labelledBy generation
    uid: string
    //listSize: number
    dense: boolean
    setPage: React.Dispatch<React.SetStateAction<number>>
    showRows: number | undefined
}

export interface TableRendererExtractorProps {
    TableRowRenderer: React.ComponentType<WidgetProps & Pick<WithValue, 'onChange'> & TableRowProps>
    TableFooter: React.ComponentType<TableFooterProps>
    TableHeader: React.ComponentType<TableHeaderProps>
    rowsPerPage: List<number>
    rowsShowAll?: boolean
}

export interface TableRendererBaseProps extends TableRendererExtractorProps {
    listSize: number
    t?: Translator
    btnAddShowLabel?: boolean
    btnAddStyle?: React.CSSProperties
}

export interface TablePaginationActionsProps {
    count: number
    page: number
    rowsPerPage: number
    onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void
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

export interface TableFooterProps extends ListButtonOverwrites {
    t?: Translator
    dense?: boolean
    readOnly?: boolean
    page: number
    setPage: React.Dispatch<React.SetStateAction<number>>
    listSize: number
    listSizeCurrent: number
    rows: number
    setRows: React.Dispatch<React.SetStateAction<number>>
    onChange: onChangeHandler
    storeKeys: WidgetProps['storeKeys']
    schema: WidgetProps['schema']
    showValidity: WidgetProps['showValidity']
    colSize: number
    rowsPerPage: List<number | { label: string, value: number }>
    rowsShowAll?: boolean
    btnShowLabel?: boolean
    btnStyle?: React.CSSProperties
}

export type TableValue = List<List<any> | OrderedMap<string, any>>
