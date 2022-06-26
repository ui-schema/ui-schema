import React from 'react'
import { visuallyHidden } from '@mui/utils'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown'
import { Trans } from '@ui-schema/ui-schema'
import { Map } from 'immutable'
import { AccessTooltipIcon } from '@ui-schema/ds-material/Component/Tooltip'
import { GenericListItemSharedProps } from '@ui-schema/ds-material'

export const GenericListItemPos = (
    {
        index, listSize, listRequired, schema,
        onChange, storeKeys, notSortable, btnSize = 'small',
    }: GenericListItemSharedProps,
): React.ReactElement => {
    const readOnly = schema.get('readOnly')
    return <React.Fragment>
        {!readOnly && !notSortable && index > 0 ?
            <IconButton
                size={btnSize}
                style={{margin: '0 auto'}}
                onClick={() =>
                    onChange({
                        storeKeys,
                        scopes: ['value', 'internal'],
                        type: 'list-item-move',
                        fromIndex: index,
                        toIndex: index - 1,
                        schema,
                        required: listRequired,
                    })
                }
            >
                <AccessTooltipIcon title={<Trans text={'labels.move-to-position'} context={Map({nextIndex: index + 1 - 1})}/>}>
                    <KeyboardArrowUp fontSize={'inherit'} style={{margin: btnSize === 'small' ? 2 : undefined}}/>
                </AccessTooltipIcon>
            </IconButton> : null}

        <Typography
            component={'p'} variant={'caption'} align={'center'}
            style={{margin: '6px 0', minWidth: '2rem'}}
        >
            {index + 1}.
            <span style={visuallyHidden}><Trans text={'labels.entry'}/></span>
        </Typography>

        {!readOnly && !notSortable && index < listSize - 1 ?
            <IconButton
                size={btnSize} style={{margin: '0 auto'}}
                onClick={() =>
                    onChange({
                        storeKeys,
                        scopes: ['value', 'internal'],
                        type: 'list-item-move',
                        fromIndex: index,
                        toIndex: index + 1,
                        schema,
                        required: listRequired,
                    })
                }
            >
                <AccessTooltipIcon title={<Trans text={'labels.move-to-position'} context={Map({nextIndex: index + 1 + 1})}/>}>
                    <KeyboardArrowDown fontSize={'inherit'} style={{margin: btnSize === 'small' ? 2 : undefined}}/>
                </AccessTooltipIcon>
            </IconButton> : null}
    </React.Fragment>
}
