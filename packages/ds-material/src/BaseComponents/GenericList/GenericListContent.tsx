import React from 'react'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import FormLabel from '@mui/material/FormLabel'
import { TranslateTitle } from '@ui-schema/react/TranslateTitle'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { StoreKeys, WithOnChange } from '@ui-schema/react/UIStore'
import { ListButtonOverwrites } from '@ui-schema/ds-material/Component/ListButton'
import { MuiWidgetsBinding } from '@ui-schema/ds-material/WidgetsBinding'
import { GenericListFooterProps, GenericListItemProps, GenericListItemSharedProps } from '@ui-schema/ds-material/BaseComponents'
import Box from '@mui/material/Box'
import { GridSpacing } from '@mui/material/Grid/Grid'
import { InfoRendererType } from '@ui-schema/ds-material/Component/InfoRenderer'

export interface GenericListContentProps extends ListButtonOverwrites {
    btnAddShowLabel?: boolean
    btnAddStyle?: React.CSSProperties
    ComponentItemPos?: React.ComponentType<GenericListItemSharedProps>
    ComponentItemMore?: React.ComponentType<GenericListItemSharedProps>
    ComponentItem: React.ComponentType<GenericListItemProps>
    ComponentFooter?: React.ComponentType<GenericListFooterProps>
    listSize: number
    schemaKeys?: StoreKeys
    listSpacing?: GridSpacing
}

export const GenericListContent = <P extends WidgetProps<MuiWidgetsBinding<{ InfoRenderer?: InfoRendererType }>>>(
    {
        storeKeys, schemaKeys, schema, listSize, onChange,
        showValidity, valid, errors, required, widgets,
        ComponentItemMore, ComponentItemPos,
        ComponentItem, ComponentFooter,
        btnAddShowLabel, btnAddStyle,
        btnSize: btnSizeProp,
        btnVariant: btnVariantProp,
        btnColor: btnColorProp,
        listSpacing = 3,
    }: P & WithOnChange & GenericListContentProps,
): React.ReactElement => {
    const btnSize = (schema.getIn(['view', 'btnSize']) || btnSizeProp || 'small') as ListButtonOverwrites['btnSize']
    const deleteBtnSize = (schema.getIn(['view', 'deleteBtnSize']) || btnSizeProp || 'small') as ListButtonOverwrites['btnSize']
    const btnVariant = (schema.getIn(['view', 'btnVariant']) || btnVariantProp || undefined) as ListButtonOverwrites['btnVariant']
    const btnColor = (schema.getIn(['view', 'btnColor']) || btnColorProp || undefined) as ListButtonOverwrites['btnColor']
    const notSortable = schema.get('notSortable') as boolean | undefined
    const notAddable = schema.get('notAddable') as boolean | undefined
    const notDeletable = schema.get('notDeletable') as boolean | undefined
    const InfoRenderer = widgets?.InfoRenderer

    const info = InfoRenderer && schema?.get('info') ?
        <InfoRenderer
            schema={schema} variant={'preview'} openAs={'embed'}
            storeKeys={storeKeys} schemaKeys={schemaKeys} valid={valid} errors={errors}
        /> : null

    return <FormControl required={required} error={!valid && showValidity} component="fieldset" style={{width: '100%'}}>
        {!schema.getIn(['view', 'hideTitle']) ?
            <Box mb={1}>
                <Box mb={1}>
                    <FormLabel component="legend">
                        <TranslateTitle schema={schema} storeKeys={storeKeys}/>
                    </FormLabel>
                </Box>

                {info}
            </Box> : null}

        {schema.getIn(['view', 'hideTitle']) ?
            <Box mb={1}>{info}</Box> : null}

        <Grid container spacing={listSpacing}>
            {Array(listSize).fill(null).map((_val, i) =>
                <ComponentItem
                    key={i} index={i} listSize={listSize}
                    storeKeys={storeKeys}
                    schemaKeys={schemaKeys}
                    schema={schema} onChange={onChange}
                    listRequired={required}
                    btnSize={deleteBtnSize}
                    notSortable={notSortable}
                    notDeletable={notDeletable}
                    showValidity={showValidity}
                    ComponentPos={ComponentItemPos}
                    ComponentMore={ComponentItemMore}
                />,
            )}
        </Grid>

        {ComponentFooter ?
            <ComponentFooter
                schema={schema}
                required={required}
                storeKeys={storeKeys}
                onChange={onChange}
                errors={errors}
                showValidity={showValidity}
                btnSize={btnSize}
                btnAddShowLabel={btnAddShowLabel}
                btnAddStyle={btnAddStyle}
                btnColor={btnColor}
                btnVariant={btnVariant}
                notAddable={notAddable}
                notSortable={notSortable}
                notDeletable={notDeletable}
            /> : null}
    </FormControl>
}
