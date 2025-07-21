import Typography from '@mui/material/Typography'
import { TranslateTitle } from '@ui-schema/react/TranslateTitle'
import { StoreKeys } from '@ui-schema/react/UIStore'
import type { SomeSchema } from '@ui-schema/ui-schema/CommonTypings'
import Box from '@mui/material/Box'
import { ValidationErrorsImmutable } from '@ui-schema/ui-schema/ValidatorOutput'
import * as React from 'react'
import { InfoRendererProps } from '@ui-schema/ds-material/Component/InfoRenderer'

export interface TitleBoxReadProps {
    hideTitle?: boolean
    hasInfo?: boolean
    schema: SomeSchema
    storeKeys: StoreKeys
    valid?: boolean
    errors?: ValidationErrorsImmutable
    InfoRenderer?: React.ComponentType<InfoRendererProps>
}

export const TitleBoxRead: React.ComponentType<TitleBoxReadProps> = (
    {
        schema, storeKeys,
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
                    storeKeys={storeKeys} valid={valid} errors={errors}
                /> : null}
        </Box> : null}
    </Box>
}
