import React from 'react'
import { memo, StoreKeys, Trans, TransTitle, UIStoreActionListItemAdd, WidgetProps, WidgetsBindingFactory, WithOnChange } from '@ui-schema/ui-schema'
import { AccessTooltipIcon } from '@ui-schema/ds-material'
import IconButton from '@material-ui/core/IconButton'
import Add from '@material-ui/icons/Add'
import Box from '@material-ui/core/Box'
import Dialog from '@material-ui/core/Dialog'
import Typography, { TypographyProps } from '@material-ui/core/Typography'
import { OrderedMap } from 'immutable'
import { genId } from '@ui-schema/kit-dnd'
import { DragDropBlockComponentsBinding } from '@ui-schema/material-dnd/DragDropBlock'
import { DndBlocksRenderer } from '@ui-schema/material-dnd/DndBlocksRenderer'
import { AreaRenderer } from '@ui-schema/material-dnd/WidgetsBase/AreaRenderer'
import { injectBlock, WithDndBlock } from '@ui-schema/material-dnd/injectBlock/injectBlock'

export const DragDropAreaBase = (
    {
        widgets, block,
        ...props
    }: WidgetProps<{}, WidgetsBindingFactory<DragDropBlockComponentsBinding>> & WithOnChange & WithDndBlock
): React.ReactElement => {
    const [showSelector, setShowSelector] = React.useState(false)
    const {schema, ownKey, storeKeys, onChange, required} = props
    const btnSize = schema.getIn(['view', 'btnSize']) || 'medium'
    //const notSortable = schema.get('notSortable')
    const notAddable = schema.get('notAddable')
    //const notDeletable = schema.get('notDeletable')
    const Selector = widgets.DndBlockSelector

    if (!block) {
        throw new Error('Missing `block` in DragDropArea')
    }
    const storeKeysList = storeKeys.push(block?.listKey as string) as StoreKeys

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
            storeKeys={storeKeysList}
            required={required}
            Item={AreaRenderer}
        />

        <Dialog
            open={showSelector}
            onClose={() => setShowSelector(false)}
        >
            <Selector
                onSelect={(block) => onChange(
                    storeKeysList, ['value', 'internal'],
                    {
                        type: 'list-item-add',
                        schema,
                        required,
                        itemValue: OrderedMap({
                            [block.idKey]: genId(),
                            [block.typeKey]: block.type,
                        }),
                    } as UIStoreActionListItemAdd,
                )}
            />
        </Dialog>

        <Box mt={1}>
            {!schema.get('readOnly') && !notAddable ?
                <IconButton
                    onClick={() => setShowSelector(o => !o)}
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
export const DragDropArea = injectBlock(memo(DragDropAreaBase))
