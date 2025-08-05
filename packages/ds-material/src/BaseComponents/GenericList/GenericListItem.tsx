import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { schemaTypeIs } from '@ui-schema/ui-schema/schemaTypeIs'
import * as React from 'react'
import Divider from '@mui/material/Divider'
import { onChangeHandler, StoreKeys } from '@ui-schema/react/UIStore'
import { SchemaTypesType } from '@ui-schema/ui-schema/CommonTypings'
import { memo } from '@ui-schema/react/Utils/memo'
import { WidgetEngine } from '@ui-schema/react/WidgetEngine'
import { List } from 'immutable'
import { ListButtonOverwrites } from '@ui-schema/ds-material/Component/ListButton'
import type { SomeSchema } from '@ui-schema/ui-schema/CommonTypings'

export interface GenericListItemSharedProps {
    index: number
    listSize: number
    listRequired: boolean | undefined
    schema: SomeSchema
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

export type GenericListItemProps = GenericListItemSharedProps & GenericListItemComponents & { spacing?: number | string }

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
    const itemsSchema = schema.get('items') as SomeSchema

    return [
        <Box key={'a'}>
            <Box display={'flex'} gap={spacing}>
                {ComponentPos ?
                    <Box style={{display: 'flex', flexDirection: 'column', flexShrink: 0}}>
                        <ComponentPos {...props}/>
                    </Box> : null}

                {itemsSchema && List.isList(itemsSchema) ?
                    // tuples in root level not possible
                    // was wrong implementation <= 0.2.2
                    null :
                    schemaTypeIs(itemsSchema.get('type') as SchemaTypesType, 'array') &&
                    itemsSchema.get('items') ?
                        <Box flexGrow={1}>
                            {/* eslint-disable-next-line @typescript-eslint/no-deprecated */}
                            <Grid container spacing={2}>
                                {(itemsSchema.get('items') as SomeSchema)?.map((item, j) =>
                                    <WidgetEngine
                                        key={j}
                                        showValidity={showValidity}
                                        storeKeys={ownKeys.push(j)}
                                        schema={item as SomeSchema}
                                        parentSchema={schema}
                                    />).valueSeq()}
                            </Grid>
                        </Box> :
                        /* eslint-disable-next-line @typescript-eslint/no-deprecated */
                        <Grid container spacing={2}>
                            <WidgetEngine
                                showValidity={showValidity}
                                schema={itemsSchema} parentSchema={schema}
                                storeKeys={ownKeys}
                            />
                        </Grid>}

                {ComponentMore ?
                    <Box style={{display: 'flex', flexShrink: 0}}>
                        <ComponentMore
                            {...props}
                            btnSize={btnSize}
                        />
                    </Box> : null}
            </Box>
        </Box>,
        index < listSize - 1 ? <Box key={'b'} display={'flex'}><Divider style={{width: '100%'}}/></Box> : null,
    ] as unknown as React.ReactElement
}
export const GenericListItem = memo(GenericListItemBase)
