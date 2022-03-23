import React from 'react'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import { memo, PluginStack, schemaTypeToDistinct, StoreSchemaType, onChangeHandler, StoreKeys, SchemaTypesType } from '@ui-schema/ui-schema'
import { List } from 'immutable'
import { ListButtonOverwrites } from '@ui-schema/ds-material/Component/ListButton'
import { GridSpacing } from '@material-ui/core/Grid/Grid'

export interface GenericListItemSharedProps {
    index: number
    listSize: number
    listRequired: boolean
    schema: StoreSchemaType
    onChange: onChangeHandler
    storeKeys: StoreKeys
    schemaKeys: StoreKeys | undefined
    level: number
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
        storeKeys, schemaKeys, level,
        showValidity,
    } = props
    const ownKeys = storeKeys.push(index)
    const itemsSchema = schema.get('items') as StoreSchemaType

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
                                {(itemsSchema.get('items') as StoreSchemaType)?.map((item, j) =>
                                    <PluginStack<{ schemaKeys: StoreKeys | undefined }>
                                        key={j}
                                        showValidity={showValidity}
                                        schemaKeys={schemaKeys?.push('items').push('items').push(j)}
                                        storeKeys={ownKeys.push(j)}
                                        schema={item as StoreSchemaType}
                                        parentSchema={schema}
                                        level={level + 1}
                                    />).valueSeq()}
                            </Grid>
                        </Grid> :
                        <PluginStack<{ schemaKeys: StoreKeys | undefined }>
                            showValidity={showValidity}
                            schema={itemsSchema} parentSchema={schema}
                            storeKeys={ownKeys} level={level + 1}
                            schemaKeys={schemaKeys?.push('items')}
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
        index < listSize - 1 ? <Divider key={'b'} style={{width: '100%'}}/> : null,
    ] as unknown as React.ReactElement
}
export const GenericListItem = memo(GenericListItemBase)
