import type { MuiBindingComponents } from '@ui-schema/ds-material/BindingType'
import type { UIMetaContext } from '@ui-schema/react/UIMeta'
import type { WithOnChange } from '@ui-schema/react/UIStore'
import type { WidgetPayload } from '@ui-schema/ui-schema/Widget'
import type { ComponentType, CSSProperties, ReactNode } from 'react'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import { TranslateTitle } from '@ui-schema/react/TranslateTitle'
import type { BindingTypeGeneric } from '@ui-schema/react/Widget'
import type { ListButtonOverwrites } from '@ui-schema/ds-material/Component/ListButton'
import type { GenericListFooterProps, GenericListItemProps, GenericListItemSharedProps } from '@ui-schema/ds-material/BaseComponents/GenericList'
import Box from '@mui/material/Box'

export interface GenericListContentProps extends ListButtonOverwrites {
    btnAddShowLabel?: boolean
    btnAddStyle?: CSSProperties
    ComponentItemPos?: ComponentType<GenericListItemSharedProps>
    ComponentItemMore?: ComponentType<GenericListItemSharedProps>
    ComponentItem: ComponentType<GenericListItemProps>
    ComponentFooter?: ComponentType<GenericListFooterProps>
    listSize: number
    listSpacing?: number | string
}

export const GenericListContent = (
    {
        storeKeys, schema, listSize, onChange,
        showValidity, valid, errors, required, binding,
        ComponentItemMore, ComponentItemPos,
        ComponentItem, ComponentFooter,
        btnAddShowLabel, btnAddStyle,
        btnSize: btnSizeProp,
        btnVariant: btnVariantProp,
        btnColor: btnColorProp,
        listSpacing = 3,
    }: WidgetPayload & UIMetaContext<BindingTypeGeneric & MuiBindingComponents> & WithOnChange & GenericListContentProps,
): ReactNode => {
    const btnSize = (schema.getIn(['view', 'btnSize']) || btnSizeProp || 'small') as ListButtonOverwrites['btnSize']
    const deleteBtnSize = (schema.getIn(['view', 'deleteBtnSize']) || btnSizeProp || 'small') as ListButtonOverwrites['btnSize']
    const btnVariant = (schema.getIn(['view', 'btnVariant']) || btnVariantProp || undefined) as ListButtonOverwrites['btnVariant']
    const btnColor = (schema.getIn(['view', 'btnColor']) || btnColorProp || undefined) as ListButtonOverwrites['btnColor']
    const notSortable = schema.get('notSortable') as boolean | undefined
    const notAddable = schema.get('notAddable') as boolean | undefined
    const notDeletable = schema.get('notDeletable') as boolean | undefined
    const InfoRenderer = binding?.InfoRenderer

    const info = InfoRenderer && schema?.get('info') ?
        <InfoRenderer
            schema={schema} variant={'preview'} openAs={'embed'}
            storeKeys={storeKeys} valid={valid} errors={errors}
        /> : null

    return <FormControl required={required} error={!valid && showValidity} component="fieldset" style={{width: '100%'}}>
        {!schema.getIn(['view', 'hideTitle']) ?
            <Box mb={1}>
                <Box mb={info ? 1 : 0}>
                    <FormLabel component="legend">
                        <TranslateTitle schema={schema} storeKeys={storeKeys}/>
                    </FormLabel>
                </Box>

                {info}
            </Box> : null}

        {schema.getIn(['view', 'hideTitle']) ?
            <Box mb={1}>{info}</Box> : null}

        <Box display={'flex'} flexDirection={'column'} rowGap={listSpacing}>
            {Array(listSize).fill(null).map((_val, i) =>
                <ComponentItem
                    key={i} index={i} listSize={listSize}
                    storeKeys={storeKeys}
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
        </Box>

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
