import { ListButton, ListButtonOverwrites } from '@ui-schema/ds-material/Component/ListButton'
import Add from '@mui/icons-material/Add'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { Translate } from '@ui-schema/react/Translate'
import { onChangeHandler, StoreKeys } from '@ui-schema/react/UIStore'
import { ValidationErrorsImmutable } from '@ui-schema/ui-schema/ValidatorOutput'
import { Map } from 'immutable'
import { ValidityHelperText } from '@ui-schema/ds-material/Component/LocaleHelperText'
import * as React from 'react'
import Box from '@mui/material/Box'

export interface GenericListFooterProps extends ListButtonOverwrites {
    schema: UISchemaMap
    notAddable?: boolean
    notSortable?: boolean
    notDeletable?: boolean
    onChange: onChangeHandler
    storeKeys: StoreKeys
    required?: boolean
    btnAddShowLabel?: boolean
    btnAddStyle?: React.CSSProperties
    errors: ValidationErrorsImmutable | undefined
    showValidity: boolean | undefined
}

export const GenericListFooter: React.ComponentType<GenericListFooterProps> = (
    {
        schema, required,
        onChange, storeKeys,
        notAddable,
        btnColor, btnVariant, btnSize,
        btnAddShowLabel, btnAddStyle,
        errors, showValidity,
    },
) => {
    return <Box mt={2}>
        {!schema.get('readOnly') && !notAddable ?
            <ListButton
                onClick={() => {
                    onChange({
                        storeKeys,
                        type: 'list-item-add',
                        schema,
                        required,
                    })
                }}
                btnSize={btnSize}
                btnVariant={btnVariant}
                btnColor={btnColor}
                showLabel={btnAddShowLabel}
                style={btnAddStyle}
                Icon={Add}
                title={
                    <Translate
                        text={'labels.add-item'}
                        context={Map({actionLabels: schema.get('listActionLabels')})}
                    />
                }
            /> : null}

        <ValidityHelperText
            /*
             * only pass down errors which are not for a specific sub-schema
             * todo: check if all needed are passed down
             */
            errors={errors}
            showValidity={showValidity}
            schema={schema}
        />
    </Box>
}
