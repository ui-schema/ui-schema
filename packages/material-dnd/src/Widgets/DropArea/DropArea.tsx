import React from 'react'
import { memo, Trans, TransTitle, UIStoreActionListItemAddWithValue, UIStoreActionScoped, WidgetProps, WidgetsBindingFactory, WithOnChange } from '@ui-schema/ui-schema'
import { AccessTooltipIcon } from '@ui-schema/ds-material'
import IconButton from '@mui/material/IconButton'
import Add from '@mui/icons-material/Add'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import Typography, { TypographyProps } from '@mui/material/Typography'
import { OrderedMap } from 'immutable'
import { genId } from '@ui-schema/kit-dnd'
import { DragDropBlockComponentsBinding } from '@ui-schema/material-dnd/DragDropBlock'
import { DndBlocksRenderer } from '@ui-schema/material-dnd/DndBlocksRenderer'
import { DndBlock } from '@ui-schema/material-dnd/DragDropBlockProvider'
import { AreaRenderer } from '@ui-schema/material-dnd/WidgetsBase/AreaRenderer/AreaRenderer'

export const DropAreaBase = (
    {
        widgets,
        ...props
    }: WidgetProps<WidgetsBindingFactory<DragDropBlockComponentsBinding>> & WithOnChange
): React.ReactElement => {
    const [showSelector, setShowSelector] = React.useState(false)
    const {schema, ownKey, storeKeys, onChange, required} = props
    const btnSize = schema.getIn(['view', 'btnSize']) || 'medium'
    //const notSortable = schema.get('notSortable')
    const notAddable = schema.get('notAddable')
    //const notDeletable = schema.get('notDeletable')
    const Selector = widgets.DndBlockSelector

    return <>
        {schema.getIn(['view', 'showTitle']) ? <Typography
            variant={(schema.getIn(['view', 'titleVariant']) as TypographyProps['variant']) || 'h5'}
            component={(schema.getIn(['view', 'titleComp']) as React.ElementType) || 'p'}
            gutterBottom
        >
            <TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/>
        </Typography> : null}

        <DndBlocksRenderer
            listSchema={schema}
            storeKeys={storeKeys}
            required={required}
            Item={AreaRenderer}
        />

        <Dialog
            open={showSelector}
            onClose={() => setShowSelector(false)}
        >
            <Selector
                onSelect={(block: DndBlock) => onChange({
                    storeKeys,
                    scopes: ['value', 'internal'],
                    type: 'list-item-add',
                    itemValue: OrderedMap({
                        [block.idKey]: genId(),
                        [block.typeKey]: block.type,
                    }),
                } as UIStoreActionListItemAddWithValue & UIStoreActionScoped)}
            />
        </Dialog>

        <Box mt={1}>
            {!schema.get('readOnly') && !notAddable ?
                <IconButton
                    onClick={() => setShowSelector(o => !o)}
                    size={btnSize as 'small' | 'medium'}
                >
                    <AccessTooltipIcon title={<Trans text={'labels.add-item'}/>}>
                        <Add fontSize={'inherit'}/>
                    </AccessTooltipIcon>
                </IconButton> : null}
        </Box>
    </>
}
export const DropArea = memo(DropAreaBase)
