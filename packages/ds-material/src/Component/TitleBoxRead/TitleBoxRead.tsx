import Typography from '@mui/material/Typography'
import { TranslateTitle } from '@ui-schema/react/TranslateTitle'
import { StoreKeys } from '@ui-schema/react/UIStore'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import Box from '@mui/material/Box'
import React from 'react'
import { InfoRendererProps } from '@ui-schema/ds-material/Component/InfoRenderer'
import { ValidatorErrorsType } from '@ui-schema/system/ValidatorErrors'

export interface TitleBoxReadProps {
    hideTitle?: boolean
    hasInfo?: boolean
    schema: UISchemaMap
    storeKeys: StoreKeys
    schemaKeys?: StoreKeys
    valid?: boolean
    errors?: ValidatorErrorsType
    InfoRenderer?: React.ComponentType<InfoRendererProps>
}

export const TitleBoxRead: React.ComponentType<TitleBoxReadProps> = (
    {
        schema, storeKeys, schemaKeys,
        errors, valid,
        hideTitle,
        hasInfo,
        InfoRenderer,
    },
) => {
    return <Box style={{display: 'flex', opacity: 0.75}}>
        {hideTitle ? null :
            <Typography
                variant={'caption'}
                color={!valid ? 'error' : 'textSecondary'}
            >
                <TranslateTitle schema={schema} storeKeys={storeKeys}/>
            </Typography>}
        {hasInfo ? <Box>
            {InfoRenderer && schema?.get('info') ?
                <InfoRenderer
                    schema={schema} variant={'icon'} openAs={'modal'}
                    storeKeys={storeKeys} schemaKeys={schemaKeys} valid={valid} errors={errors}
                /> : null}
        </Box> : null}
    </Box>
}
