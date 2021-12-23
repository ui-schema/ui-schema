import React from 'react'
import { useUID } from 'react-uid'
import { memo, StoreSchemaType, Trans, TransTitle, UIStoreActionListItemAdd, WidgetProps, WithOnChange } from '@ui-schema/ui-schema'
import { AccessTooltipIcon } from '@ui-schema/ds-material'
import IconButton from '@material-ui/core/IconButton'
import Add from '@material-ui/icons/Add'
import Box from '@material-ui/core/Box'
import Typography, { TypographyProps } from '@material-ui/core/Typography'
import { OrderedMap } from 'immutable'
import { genId } from '@ui-schema/kit-dnd'
import { DndListRenderer } from '@ui-schema/material-dnd/DndListRenderer'
import { SortableListItem } from '@ui-schema/material-dnd/WidgetsBase/SortableListItem'

export interface SortableListProps {
    scoped?: boolean
    idKey?: string
}

export const SortableListBase = (
    {
        idKey = '_bid',
        ...props
    }: WidgetProps & WithOnChange & SortableListProps
): React.ReactElement => {
    const uid = useUID()
    const {schema, ownKey, storeKeys, onChange, required} = props
    const btnSize = schema.getIn(['view', 'btnSize']) || 'medium'
    //const notSortable = schema.get('notSortable')
    const notAddable = schema.get('notAddable')
    //const notDeletable = schema.get('notDeletable')

    const itemsSchema = schema.get('items') as StoreSchemaType
    return <>
        {schema.getIn(['view', 'hideTitle']) ? null : <Typography
            variant={(schema.getIn(['view', 'titleVariant']) as TypographyProps['variant']) || 'h5'}
            component={(schema.getIn(['view', 'titleComp']) as React.ElementType) || 'p'}
            gutterBottom
        >
            <TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/>
        </Typography>}

        <DndListRenderer
            {...props}
            Item={SortableListItem}
            idKey={idKey}
            scoped={'#' + uid}
            itemsSchema={itemsSchema}
            parentSchema={schema}
            itemType={schema.get('widget') as string}
        />

        <Box mt={1}>
            {!schema.get('readOnly') && !notAddable ?
                <IconButton
                    onClick={() => {
                        onChange(
                            storeKeys, ['value', 'internal'],
                            {
                                type: 'list-item-add',
                                schema,
                                required,
                                itemValue: OrderedMap({
                                    [idKey]: genId(),
                                }),
                            } as UIStoreActionListItemAdd,
                        )
                    }}
                    size={btnSize as 'small' | 'medium'}
                >
                    {/* @ts-ignore */}
                    <AccessTooltipIcon title={<Trans text={'labels.add-item'}/>}>
                        <Add fontSize={'inherit'}/>
                    </AccessTooltipIcon>
                </IconButton> : null}
        </Box>
    </>
}
export const SortableList = memo(SortableListBase)
