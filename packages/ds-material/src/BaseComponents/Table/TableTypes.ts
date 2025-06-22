import { onChangeHandler, StoreKeys, WithValue } from '@ui-schema/react/UIStore'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { Translator } from '@ui-schema/ui-schema/Translator'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import React from 'react'
import { List, OrderedMap } from 'immutable'
import { ListButtonOverwrites } from '@ui-schema/ds-material/Component/ListButton'

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
    noFirstPageButton?: boolean
    noLastPageButton?: boolean
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
    schema: UISchemaMap
    itemsSchema: UISchemaMap
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
    storeKeys: StoreKeys
    schema: UISchemaMap
    showValidity: boolean | undefined
    colSize: number
    rowsPerPage: List<number | { label: string, value: number }>
    rowsShowAll?: boolean
    btnShowLabel?: boolean
    btnStyle?: React.CSSProperties
    noFirstPageButton?: boolean
    noLastPageButton?: boolean
}

export type TableValue = List<List<any> | OrderedMap<string, any>>
