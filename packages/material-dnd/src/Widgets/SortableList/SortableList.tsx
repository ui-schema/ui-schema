import * as React from 'react'
import { memo } from '@ui-schema/react/Utils/memo'
import { WithOnChange } from '@ui-schema/react/UIStore'
import { Translate } from '@ui-schema/react/Translate'
import { TranslateTitle } from '@ui-schema/react/TranslateTitle'
import { WidgetProps } from '@ui-schema/react/Widget'
import { UIStoreActionListItemAdd, UIStoreActionScoped } from '@ui-schema/react/UIStoreActions'
import { AccessTooltipIcon } from '@ui-schema/ds-material/Component/Tooltip'
import IconButton from '@mui/material/IconButton'
import Add from '@mui/icons-material/Add'
import Box from '@mui/material/Box'
import Typography, { TypographyProps } from '@mui/material/Typography'
import { OrderedMap } from 'immutable'
import { genId } from '@ui-schema/kit-dnd'
import { DndListRenderer } from '@ui-schema/material-dnd/DndListRenderer'
import { SortableListItem } from '@ui-schema/material-dnd/WidgetsBase/SortableListItem'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'

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
    const uid = React.useId()
    const {schema, storeKeys, onChange} = props
    const btnSize = schema.getIn(['view', 'btnSize']) || 'medium'
    //const notSortable = schema.get('notSortable')
    const notAddable = schema.get('notAddable')
    //const notDeletable = schema.get('notDeletable')

    const itemsSchema = schema.get('items') as UISchemaMap
    return <>
        {schema.getIn(['view', 'hideTitle']) ? null :
            <Typography
                variant={(schema.getIn(['view', 'titleVariant']) as TypographyProps['variant']) || 'h5'}
                component={(schema.getIn(['view', 'titleComp']) as React.ElementType) || 'p'}
                gutterBottom
            >
                <TranslateTitle schema={schema} storeKeys={storeKeys}/>
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
                            type: 'list-item-add',
                            itemValue: OrderedMap({
                                [idKey]: genId(),
                            }),
                        } as UIStoreActionListItemAdd & UIStoreActionScoped)
                    }}
                    size={btnSize as 'small' | 'medium'}
                >
                    <AccessTooltipIcon title={<Translate text={'labels.add-item'}/>}>
                        <Add fontSize={'inherit'}/>
                    </AccessTooltipIcon>
                </IconButton> : null}
        </Box>
    </>
}
export const SortableList = memo(SortableListBase)
