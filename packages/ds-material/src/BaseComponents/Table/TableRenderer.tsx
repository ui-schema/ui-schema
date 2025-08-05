import { MuiBindingComponents } from '@ui-schema/ds-material/BindingType'
import { useSchemaResource } from '@ui-schema/react/SchemaResourceProvider'
import { getFields } from '@ui-schema/ui-schema/getFields'
import * as React from 'react'
import { extractValue, WithOnChange } from '@ui-schema/react/UIStore'
import { TranslateTitle } from '@ui-schema/react/TranslateTitle'
import { memo } from '@ui-schema/react/Utils/memo'
import { WidgetEngine } from '@ui-schema/react/WidgetEngine'
import { WidgetProps, BindingTypeGeneric } from '@ui-schema/react/Widget'
import { List, OrderedMap } from 'immutable'
import MuiTable from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import { TableRendererBaseProps, TableRendererExtractorProps, TableRowProps, TableContext } from '@ui-schema/ds-material/BaseComponents/Table'
import { ListButtonOverwrites } from '@ui-schema/ds-material/Component'

export const TableRendererBase: React.ComponentType<Omit<WidgetProps<BindingTypeGeneric & MuiBindingComponents>, 'value' | 'internalValue' | 'errors' | 'valid'> & WithOnChange & TableRendererBaseProps & ListButtonOverwrites> = (
    {
        storeKeys, schema, onChange,
        required,
        showValidity,
        // binding must come from an own wrapper component, to overwrite/enable any widgets for special `TableCell` formatting
        binding,
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
    },
) => {
    const uid = React.useId()
    const {resource} = useSchemaResource()
    const [page, setPage] = React.useState(0)
    const [rows, setRows] = React.useState(rowsPerPage.first() || 5)
    const btnSize = (schema.getIn(['view', 'btnSize']) || btnSizeProp || 'small') as ListButtonOverwrites['btnSize']
    const btnVariant = (schema.getIn(['view', 'btnVariant']) || btnVariantProp || undefined) as ListButtonOverwrites['btnVariant']
    const btnColor = (schema.getIn(['view', 'btnColor']) || btnColorProp || undefined) as ListButtonOverwrites['btnColor']

    const dense = (schema.getIn(['view', 'dense']) as boolean) || false
    const itemsSchema = React.useMemo(() => {
        const schemaFields = getFields(schema, {resource})
        const staticSchema = schemaFields.getStaticSchema()
        // a Table can only be in an array with a homogeneous items,
        // the schema in `.items` is prepared to contain e.g. titles in available root branch
        return staticSchema?.get('items')
    }, [schema, resource])

    const readOnly = schema.get('readOnly') as boolean

    const currentRows = rows === -1 ? listSize || 0 : rows
    const currentRowsStartVisible = page * currentRows

    const validItemSchema =
        itemsSchema && (
            itemsSchema?.get('prefixItems')
            || List.isList(itemsSchema?.get('items'))
            || itemsSchema?.get('properties')
        )

    const visibleCols = (
        (itemsSchema?.get('prefixItems') as List<any>)?.filter(p => !p.get('hidden')) ||
        (List.isList(itemsSchema?.get('items')) ? (itemsSchema.get('items') as List<any>)?.filter(p => !p.get('hidden')) : undefined) ||
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
                            return <WidgetEngine<TableRowProps, typeof TableRowRenderer>
                                key={i}
                                storeKeys={storeKeys.push(i as number)}
                                schema={itemsSchema}
                                parentSchema={schema}
                                isVirtual={isVirtual}
                                noGrid

                                binding={binding}
                                WidgetOverride={TableRowRenderer}
                                setPage={setPage}
                                showRows={isVirtual ? undefined : rows}
                                requiredList={required}
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

export const TableRendererExtractor: React.ComponentType<WidgetProps<BindingTypeGeneric & MuiBindingComponents> & TableRendererExtractorProps> = (
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
    },
) => {
    // extracting and calculating the list size here, not passing down the actual list for performance reasons
    // https://github.com/ui-schema/ui-schema/issues/115
    return <TableContext.Provider value={{errors, valid}}>
        <TableRendererBaseMemo {...props} listSize={List.isList(value) ? value.size : 0}/>
    </TableContext.Provider>
}

export const TableRendererMemo = memo(TableRendererExtractor)
export const TableRenderer = extractValue(TableRendererMemo)
