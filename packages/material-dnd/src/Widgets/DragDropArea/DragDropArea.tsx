import * as React from 'react'
import { memo } from '@ui-schema/react/Utils/memo'
import { StoreKeys } from '@ui-schema/react/UIStore'
import { Translate } from '@ui-schema/react/Translate'
import { TranslateTitle } from '@ui-schema/react/TranslateTitle'
import { WidgetProps, BindingTypeGeneric } from '@ui-schema/react/Widget'
import { UIStoreActionListItemAdd, UIStoreActionScoped } from '@ui-schema/react/UIStoreActions'
import { AccessTooltipIcon } from '@ui-schema/ds-material/Component/Tooltip'
import IconButton from '@mui/material/IconButton'
import Add from '@mui/icons-material/Add'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import Typography, { TypographyProps } from '@mui/material/Typography'
import { OrderedMap } from 'immutable'
import { genId } from '@ui-schema/kit-dnd'
import { DndBlocksRenderer } from '@ui-schema/material-dnd/DndBlocksRenderer'
import { AreaRenderer } from '@ui-schema/material-dnd/WidgetsBase/AreaRenderer'
import { injectBlock, WithDndBlock } from '@ui-schema/material-dnd/injectBlock'
import { DragDropBlockComponentsBinding } from '../../DragDropBlock'

export const DragDropAreaBase = (
    {
        binding, block,
        ...props
    }: WidgetProps<BindingTypeGeneric & DragDropBlockComponentsBinding> & WithDndBlock,
): React.ReactElement => {
    const [showSelector, setShowSelector] = React.useState(false)
    const {schema, storeKeys, onChange, required} = props
    const btnSize = schema.getIn(['view', 'btnSize']) || 'medium'
    //const notSortable = schema.get('notSortable')
    const notAddable = schema.get('notAddable')
    //const notDeletable = schema.get('notDeletable')
    const Selector = binding?.DndBlockSelector

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
            <TranslateTitle schema={schema} storeKeys={storeKeys}/>
        </Typography> : null}

        <DndBlocksRenderer
            listSchema={schema}
            storeKeys={storeKeysList}
            required={required}
            Item={AreaRenderer}
        />

        {Selector ?
            <Dialog
                open={showSelector}
                onClose={() => setShowSelector(false)}
            >
                <Selector
                    onSelect={(block) => onChange({
                        storeKeys: storeKeysList,
                        type: 'list-item-add',
                        itemValue: OrderedMap({
                            [block.idKey]: genId(),
                            [block.typeKey]: block.type,
                        }),
                    } as UIStoreActionListItemAdd & UIStoreActionScoped)}
                />
            </Dialog> : null}

        <Box mt={1}>
            {!schema.get('readOnly') && !notAddable && Selector ?
                <IconButton
                    onClick={() => setShowSelector(o => !o)}
                    size={btnSize as 'small' | 'medium'}
                >
                    <AccessTooltipIcon title={<Translate text={'labels.add-item'}/>}>
                        <Add fontSize={'inherit'}/>
                    </AccessTooltipIcon>
                </IconButton> : null}
        </Box>
    </>
}
export const DragDropArea = injectBlock(memo(DragDropAreaBase))
