import React from 'react'
import Grid, { GridSpacing } from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { onChangeHandler, StoreKeys } from '@ui-schema/react/UIStore'
import { SchemaTypesType } from '@ui-schema/ui-schema/CommonTypings'
import { memo } from '@ui-schema/react/Utils/memo'
import { WidgetEngine } from '@ui-schema/react/WidgetEngine'
import { schemaTypeToDistinct } from '@ui-schema/ui-schema/schemaTypeToDistinct'
import { List } from 'immutable'
import { ListButtonOverwrites } from '@ui-schema/ds-material/Component/ListButton'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'

export interface GenericListItemSharedProps {
    index: number
    listSize: number
    listRequired: boolean | undefined
    schema: UISchemaMap
    onChange: onChangeHandler
    storeKeys: StoreKeys
    notSortable: boolean | undefined
    notDeletable: boolean | undefined
    showValidity: boolean | undefined
    btnSize?: ListButtonOverwrites['btnSize']
}

export interface GenericListItemComponents {
    ComponentPos?: React.ComponentType<GenericListItemSharedProps>
    ComponentMore?: React.ComponentType<GenericListItemSharedProps>
}

export type GenericListItemProps = GenericListItemSharedProps & GenericListItemComponents & { spacing?: GridSpacing }

export const GenericListItemBase = (
    {
        ComponentPos,
        ComponentMore,
        spacing = 2,
        btnSize, ...props
    }: GenericListItemProps,
): React.ReactElement => {
    const {
        index, listSize, schema,
        storeKeys,
        showValidity,
    } = props
    const ownKeys = storeKeys.push(index)
    const itemsSchema = schema.get('items') as UISchemaMap

    return [
        <Grid key={'a'} item xs={12} style={{display: 'flex'}}>
            <Grid container spacing={spacing} wrap={'nowrap'}>
                {ComponentPos ?
                    <Grid item style={{display: 'flex', flexDirection: 'column', flexShrink: 0}}>
                        <ComponentPos {...props}/>
                    </Grid> : null}

                {itemsSchema && List.isList(itemsSchema) ?
                    // tuples in root level not possible
                    // was wrong implementation <= 0.2.2
                    null :
                    schemaTypeToDistinct(itemsSchema.get('type') as SchemaTypesType) === 'array' &&
                    itemsSchema.get('items') ?
                        <Grid item style={{display: 'flex', flexDirection: 'column', flexGrow: 2}}>
                            <Grid container spacing={2}>
                                {(itemsSchema.get('items') as UISchemaMap)?.map((item, j) =>
                                    <WidgetEngine
                                        key={j}
                                        showValidity={showValidity}
                                        storeKeys={ownKeys.push(j)}
                                        schema={item as UISchemaMap}
                                        parentSchema={schema}
                                    />).valueSeq()}
                            </Grid>
                        </Grid> :
                        <WidgetEngine
                            showValidity={showValidity}
                            schema={itemsSchema} parentSchema={schema}
                            storeKeys={ownKeys}
                        />}

                {ComponentMore ?
                    <Grid item style={{display: 'flex', flexShrink: 0}}>
                        <ComponentMore
                            {...props}
                            btnSize={btnSize}
                        />
                    </Grid> : null}
            </Grid>
        </Grid>,
        index < listSize - 1 ? <Grid key={'b'} item xs={12} style={{display: 'flex'}}><Divider style={{width: '100%'}}/></Grid> : null,
    ] as unknown as React.ReactElement
}
export const GenericListItem = memo(GenericListItemBase)
