import React from 'react'
import { useUID } from 'react-uid'
import { memo, StoreSchemaType, Trans, TransTitle, UIStoreActionListItemAdd, UIStoreActionScoped, WidgetProps, WithOnChange } from '@ui-schema/ui-schema'
import { AccessTooltipIcon } from '@ui-schema/ds-material'
import IconButton from '@mui/material/IconButton'
import Add from '@mui/icons-material/Add'
import Box from '@mui/material/Box'
import Typography, { TypographyProps } from '@mui/material/Typography'
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
    const {schema, ownKey, storeKeys, onChange} = props
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
                        onChange({
                            storeKeys,
                            scopes: ['value', 'internal'],
                            type: 'list-item-add',
                            itemValue: OrderedMap({
                                [idKey]: genId(),
                            }),
                        } as UIStoreActionListItemAdd & UIStoreActionScoped)
                    }}
                    size={btnSize as 'small' | 'medium'}
                >
                    <AccessTooltipIcon title={<Trans text={'labels.add-item'}/>}>
                        <Add fontSize={'inherit'}/>
                    </AccessTooltipIcon>
                </IconButton> : null}
        </Box>
    </>
}
export const SortableList = memo(SortableListBase)
