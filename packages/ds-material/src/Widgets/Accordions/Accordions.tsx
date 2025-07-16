import { MuiBindingComponents } from '@ui-schema/ds-material/Binding'
import { ValidationErrorsImmutable } from '@ui-schema/ui-schema/ValidatorOutput'
import React from 'react'
import { OrderedMap } from 'immutable'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { WidgetProps, BindingTypeGeneric } from '@ui-schema/react/Widget'
import { TranslateTitle } from '@ui-schema/react/TranslateTitle'
import { WidgetEngine } from '@ui-schema/react/WidgetEngine'
import { memo } from '@ui-schema/react/Utils/memo'
import { StoreKeys, StoreKeyType, useUIStore, Validity } from '@ui-schema/react/UIStore'
import { isInvalid } from '@ui-schema/react/isInvalid'
import { ValidityHelperText } from '@ui-schema/ds-material/Component/LocaleHelperText'
import Accordion, { AccordionProps } from '@mui/material/Accordion'
import Box from '@mui/material/Box'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography, { TypographyProps } from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

export interface AccordionStackBaseProps {
    isOpen: boolean
    setOpen: (handler: (ownKey: string) => string) => void
    SummaryTitle?: AccordionsRendererProps['SummaryTitle']
}

const AccordionStackBase: React.ComponentType<WidgetProps<BindingTypeGeneric & MuiBindingComponents> & AccordionStackBaseProps & { validity: Validity | undefined }> = (
    {validity, SummaryTitle, ...props},
) => {
    const uid = React.useId()
    const {
        storeKeys, schema,
        parentSchema,
        showValidity,
        isOpen, setOpen, valid, binding,
    } = props
    const errors = validity?.get('errors') as ValidationErrorsImmutable | undefined
    const elevation = parentSchema?.getIn(['view', 'ev']) as AccordionProps['elevation']
    const variant = parentSchema?.getIn(['view', 'variant']) as AccordionProps['variant']
    const titleVariant = parentSchema?.getIn(['view', 'titleVariant']) as TypographyProps['variant']
    const childInvalid = isInvalid(validity)
    const InfoRenderer = binding?.InfoRenderer

    const ownKey = storeKeys.last()

    return <Accordion
        style={{width: '100%'}} expanded={isOpen}
        onChange={() => setOpen(k => k === ownKey ? '' : ownKey as string)}
        variant={variant} elevation={elevation}
    >
        <AccordionSummary
            expandIcon={<ExpandMoreIcon/>}
            id={'uis-' + uid}
        >
            {SummaryTitle ?
                <SummaryTitle
                    valid={Boolean(valid)}
                    childInvalid={childInvalid > 0}
                    storeKeys={storeKeys}
                    parentSchema={parentSchema}
                    schema={schema}
                    isOpen={isOpen}
                /> :
                <Typography color={!showValidity || (!childInvalid && valid) ? undefined : 'error'} variant={titleVariant}>
                    <TranslateTitle schema={schema} storeKeys={storeKeys}/>
                </Typography>}
        </AccordionSummary>
        <AccordionDetails style={{flexDirection: 'column'}}>
            {InfoRenderer && schema?.get('info') ?
                <Box>
                    <InfoRenderer
                        schema={schema} variant={'preview'} openAs={'embed'}
                        storeKeys={storeKeys} valid={valid} errors={errors}
                    />
                </Box> : undefined}

            <WidgetEngine
                {...props}
                schema={schema}
                parentSchema={parentSchema}
                storeKeys={storeKeys}
                isVirtual={props.isVirtual || (parentSchema?.get('onClosedHidden') as boolean && !isOpen)}
            />
            <ValidityHelperText
                errors={errors} showValidity={showValidity} schema={schema}
            />
        </AccordionDetails>
    </Accordion>
}

export const AccordionStack = memo(AccordionStackBase)

export interface AccordionsRendererProps {
    SummaryTitle?: React.ComponentType<{
        childInvalid: boolean
        valid: boolean
        isOpen: boolean
        schema: UISchemaMap
        parentSchema: UISchemaMap | undefined
        storeKeys: StoreKeys
    }>
}

export const AccordionsRendererBase = (
    {
        schema, storeKeys,
        errors, showValidity,
        ...props
    }: WidgetProps<BindingTypeGeneric & MuiBindingComponents>,
): React.ReactElement => {
    const {store} = useUIStore()
    const [open, setOpen] = React.useState<string>(schema.get('defaultExpanded') as string || '')

    const properties = schema.get('properties') as OrderedMap<string, any> | undefined

    return <>
        {properties?.map((childSchema: UISchemaMap, childKey: StoreKeyType): React.ReactElement =>
            <AccordionStack
                key={childKey}
                {...props}
                schema={childSchema}
                parentSchema={schema}
                storeKeys={storeKeys.push(childKey)}
                isOpen={open === childKey}
                setOpen={setOpen}
                showValidity={showValidity}
                validity={store?.extractValidity(storeKeys.push(childKey))}
            />,
        )
            .valueSeq()
            .toArray()}

        <ValidityHelperText
            errors={errors} showValidity={showValidity} schema={schema}
        />
    </>
}

export const AccordionsRenderer = memo(AccordionsRendererBase)
