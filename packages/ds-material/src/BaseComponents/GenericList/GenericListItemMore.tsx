import React from 'react'
import IconButton from '@mui/material/IconButton'
import { Trans } from '@ui-schema/ui-schema'
import { AccessTooltipIcon } from '@ui-schema/ds-material/Component/Tooltip'
import { GenericListItemSharedProps } from '@ui-schema/ds-material/BaseComponents/GenericList'
import Delete from '@mui/icons-material/Delete'
import { Map } from 'immutable'

export const GenericListItemMore = (
    {
        index, listRequired, schema,
        onChange, storeKeys, notDeletable, btnSize = 'small',
    }: GenericListItemSharedProps,
): React.ReactElement => {
    const readOnly = schema.get('readOnly')
    return <React.Fragment>
        {!readOnly && !notDeletable ?
            <IconButton
                onClick={() =>
                    onChange({
                        storeKeys,
                        scopes: ['value', 'internal'],
                        type: 'list-item-delete',
                        index: index,
                        schema,
                        required: listRequired,
                    })
                }
                size={btnSize}
                style={{margin: '0 0 auto 0'}}
            >
                <AccessTooltipIcon
                    title={
                        <Trans text={'labels.remove-item'} context={Map({actionLabels: schema.get('listActionLabels')})}/>
                    }
                >
                    <Delete fontSize={'inherit'} style={{margin: btnSize === 'small' ? 2 : undefined}}/>
                </AccessTooltipIcon>
            </IconButton> : null}
    </React.Fragment>
}
