import React from 'react'
import { useUID } from 'react-uid'
import { extractValue, WithValue } from '@ui-schema/react/UIStore'
import { useUIMeta } from '@ui-schema/react/UIMeta'
import { TranslateTitle } from '@ui-schema/react/TranslateTitle'
import { memo } from '@ui-schema/react/Utils/memo'
import { WidgetEngine } from '@ui-schema/react/WidgetEngine'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { SchemaTypesType } from '@ui-schema/system/CommonTypings'
import { schemaTypeIsAny } from '@ui-schema/system/schemaTypeIs'
import { List, Map, OrderedMap } from 'immutable'
import MuiTable from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import { TableRendererBaseProps, TableRendererExtractorProps, TableRowProps, TableContext } from '@ui-schema/ds-material/BaseComponents/Table'
import { ListButtonOverwrites } from '@ui-schema/ds-material/Component'
import { UISchemaMap } from '@ui-schema/system/Definitions'

export const TableRendererBase: React.ComponentType<Pick<WidgetProps, Exclude<keyof WidgetProps, 'value' | 'errors' | 'valid'>> & Pick<WithValue, 'onChange'> & TableRendererBaseProps & ListButtonOverwrites> = (
    {
        storeKeys, schema, onChange,
        showValidity,
        // widgets must come from an own wrapper component, to overwrite/enable any widgets for special `TableCell` formatting
        widgets,
        TableRowRenderer,
        TableFooter,
        TableHeader,
        listSize, t,
        noFirstPageButton, noLastPageButton,
        btnAddShowLabel, btnAddStyle,
        rowsPerPage, rowsShowAll,
        btnSize: btnSizeProp,
        btnVariant: btnVariantProp,
        btnColor: btnColorProp,
    }
) => {
    const uid = useUID()
    const [page, setPage] = React.useState(0)
    const [rows, setRows] = React.useState(rowsPerPage.first())
    const btnSize = (schema.getIn(['view', 'btnSize']) || btnSizeProp || 'small') as ListButtonOverwrites['btnSize']
    const btnVariant = (schema.getIn(['view', 'btnVariant']) || btnVariantProp || undefined) as ListButtonOverwrites['btnVariant']
    const btnColor = (schema.getIn(['view', 'btnColor']) || btnColorProp || undefined) as ListButtonOverwrites['btnColor']

    const dense = (schema.getIn(['view', 'dense']) as boolean) || false
    const itemsSchema = schema.get('items') as UISchemaMap
    const readOnly = schema.get('readOnly') as boolean

    const currentRows = rows === -1 ? listSize || 0 : rows
    const currentRowsStartVisible = page * currentRows

    const validItemSchema = itemsSchema && Map.isMap(itemsSchema) &&
        schemaTypeIsAny(itemsSchema.get('type') as SchemaTypesType, ['array', 'object'])

    if (process.env.NODE_ENV === 'development' && !validItemSchema) {
        console.error('TableRenderer invalid `items` schema at storeKeys:', storeKeys?.toJS(), itemsSchema.toJS())
    }

    const visibleCols = (
        (itemsSchema.get('items') as List<any>)?.filter(p => !p.get('hidden')) ||
        (itemsSchema.get('properties') as OrderedMap<string, any>)?.filter(p => !p.get('hidden')).keySeq()
    )

    return <>
        {!schema.getIn(['view', 'hideTitle']) ?
            <TranslateTitle schema={schema} storeKeys={storeKeys}/> : null}

        <TableContainer>
            <MuiTable size={dense ? 'small' : 'medium'}>
                <TableHeader
                    uid={uid}
                    validItemSchema={validItemSchema}
                    itemsSchema={itemsSchema}
                    schema={schema}
                    storeKeys={storeKeys}
                    dense={dense}
                    readOnly={readOnly}
                />

                <TableBody>
                    {validItemSchema && listSize ?
                        Array(listSize).fill(null).map((_val: any, i) => {
                            const isVirtual = (i as number) < currentRowsStartVisible || (i as number) >= (currentRowsStartVisible + currentRows)
                            return <WidgetEngine<TableRowProps & WidgetProps>
                                key={i}
                                storeKeys={storeKeys.push(i as number)}
                                schema={itemsSchema}
                                parentSchema={schema}
                                isVirtual={isVirtual}
                                noGrid

                                widgets={widgets}
                                WidgetOverride={TableRowRenderer}
                                setPage={setPage}
                                showRows={isVirtual ? undefined : rows}
                                uid={uid}
                                // todo: some table rows like `DragDrop` would need info like "is-first-row", "is-last-row", "is-only-row"
                                //listSize={listSize}
                                dense={dense}
                            />
                        }) : null}
                </TableBody>

                <TableFooter
                    colSize={visibleCols?.size || 0}
                    t={t}
                    listSize={listSize}
                    listSizeCurrent={listSize}
                    btnSize={btnSize}
                    btnVariant={btnVariant}
                    btnColor={btnColor}
                    btnShowLabel={btnAddShowLabel}
                    btnStyle={btnAddStyle}
                    schema={schema}
                    setPage={setPage}
                    page={page}
                    setRows={setRows}
                    rows={rows}
                    storeKeys={storeKeys}
                    showValidity={showValidity}
                    onChange={onChange}
                    dense={dense}
                    readOnly={readOnly}
                    rowsPerPage={rowsPerPage}
                    rowsShowAll={rowsShowAll}
                    noFirstPageButton={noFirstPageButton}
                    noLastPageButton={noLastPageButton}
                />
            </MuiTable>
        </TableContainer>
    </>
}

export const TableRendererBaseMemo = memo(TableRendererBase)

export const TableRendererExtractor: React.ComponentType<WidgetProps & WithValue & TableRendererExtractorProps> = (
    {
        value,
        // remove `internalValue` from the table widget, performance optimize
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        internalValue,
        // remove `errors` from the table widget, performance optimize
        errors,
        // remove `valid` from the table widget, performance optimize
        valid,
        ...props
    }
) => {
    const {t} = useUIMeta()
    // extracting and calculating the list size here, not passing down the actual list for performance reasons
    // https://github.com/ui-schema/ui-schema/issues/115
    return <TableContext.Provider value={{errors, valid}}>
        <TableRendererBaseMemo {...props} listSize={value?.size || 0} t={t}/>
    </TableContext.Provider>
}

export const TableRendererMemo = memo(TableRendererExtractor) as React.ComponentType<WidgetProps & WithValue & TableRendererExtractorProps>
export const TableRenderer = extractValue(TableRendererMemo) as React.ComponentType<WidgetProps & TableRendererExtractorProps>
