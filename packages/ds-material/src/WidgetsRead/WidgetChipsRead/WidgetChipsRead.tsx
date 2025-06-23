import { MuiComponentsBinding } from '@ui-schema/ds-material'
import React from 'react'
import { extractValue } from '@ui-schema/react/UIStore'
import { WidgetProps, WidgetsBindingFactory } from '@ui-schema/react/Widgets'
import { Translate } from '@ui-schema/react/Translate'
import { memo } from '@ui-schema/react/Utils/memo'
import { beautifyKey, tt } from '@ui-schema/ui-schema/Utils/beautify'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { ValidityHelperText } from '@ui-schema/ds-material/Component/LocaleHelperText'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import { List, Map, OrderedMap } from 'immutable'
import { TitleBoxRead } from '@ui-schema/ds-material/Component/TitleBoxRead'
import { UIMetaReadContextType } from '@ui-schema/react/UIMetaReadContext'
import Typography from '@mui/material/Typography'

export const WidgetChipsReadBase = (
    {
        storeKeys, schema, value,
        showValidity, errors,
        valid, binding,
        readDense,
    }: WidgetProps<WidgetsBindingFactory & MuiComponentsBinding> & UIMetaReadContextType,
) => {
    if (!schema) return null

    const oneOfVal = schema.getIn(['items', 'oneOf'])
    if (!oneOfVal) return null

    const hideTitle = schema.getIn(['view', 'hideTitle']) as boolean | undefined
    const InfoRenderer = binding?.InfoRenderer
    const hasInfo = Boolean(InfoRenderer && schema?.get('info')) as boolean | undefined

    const currentValue = (typeof value !== 'undefined' ? value : (List(schema.get('default') as string[]) || List())) as List<string>
    const oneOfValues = (oneOfVal as List<OrderedMap<string, any>>).filter(v => currentValue?.indexOf(v.get('const') as string) !== -1)
    return <Box>
        <TitleBoxRead
            hideTitle={hideTitle}
            hasInfo={hasInfo}
            InfoRenderer={InfoRenderer}
            valid={valid}
            errors={errors}
            storeKeys={storeKeys}
            schema={schema}
        />

        <Box style={{display: 'flex', flexWrap: 'wrap'}}>
            {oneOfValues?.size ?
                oneOfValues.map((oneOfSchema) =>
                    <Chip
                        key={oneOfSchema.get('const')}
                        label={<Translate
                            schema={oneOfSchema.get('t') as unknown as UISchemaMap}
                            text={oneOfSchema.get('title') as string || oneOfSchema.get('const') as string}
                            context={Map({'relative': List(['title'])})}
                            fallback={oneOfSchema.get('title') || beautifyKey(oneOfSchema.get('const') as string | number, oneOfSchema.get('tt') as tt)}
                        />}
                        style={{marginRight: 4, marginBottom: readDense ? 2 : 4}}
                        size={!readDense && schema.getIn(['view', 'size']) === 'medium' ? 'medium' : 'small'}
                        variant={'filled'}
                        color={'primary'}
                    />,
                ).valueSeq() :
                <Typography variant={readDense ? 'body2' : 'body1'} style={{opacity: 0.65}}>-</Typography>
            }
        </Box>

        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </Box>
}

export const WidgetChipsRead = extractValue(memo(WidgetChipsReadBase))
