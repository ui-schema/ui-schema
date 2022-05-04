import React from 'react'
import { OrderedMap } from 'immutable'
import { useUID } from 'react-uid'
import {
    KeyType, StoreSchemaType, WidgetProps, ValidatorErrorsType, WithValidity,
    TransTitle, PluginStack, memo,
    extractValidity, StoreKeys,
} from '@ui-schema/ui-schema'
import { isInvalid } from '@ui-schema/ui-schema/ValidityReporter'
import { ValidityHelperText } from '@ui-schema/ds-material/Component/LocaleHelperText'
import Accordion, { AccordionProps } from '@mui/material/Accordion'
import Box from '@mui/material/Box'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography, { TypographyProps } from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { MuiWidgetBinding } from '@ui-schema/ds-material/widgetsBinding'

export interface AccordionStackBaseProps {
    isOpen: boolean
    setOpen: (handler: (ownKey: string) => string) => void
    SummaryTitle?: AccordionsRendererProps['SummaryTitle']
}

const AccordionStackBase: React.ComponentType<WidgetProps<MuiWidgetBinding> & AccordionStackBaseProps & WithValidity> = (
    {validity, SummaryTitle, ...props},
) => {
    const uid = useUID()
    const {
        storeKeys, schema,
        parentSchema,
        showValidity, level,
        isOpen, setOpen, valid, widgets,
    } = props
    const [errors, setErrors] = React.useState<ValidatorErrorsType | undefined>()
    const elevation = parentSchema?.getIn(['view', 'ev']) as AccordionProps['elevation']
    const variant = parentSchema?.getIn(['view', 'variant']) as AccordionProps['variant']
    const titleVariant = parentSchema?.getIn(['view', 'titleVariant']) as TypographyProps['variant']
    const childInvalid = isInvalid(validity)
    const InfoRenderer = widgets?.InfoRenderer

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
                    <TransTitle schema={schema} storeKeys={storeKeys}/>
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

            <PluginStack
                {...props}
                schema={schema}
                parentSchema={parentSchema}
                storeKeys={storeKeys} level={level}
                onErrors={setErrors}
                isVirtual={props.isVirtual || (parentSchema?.get('onClosedHidden') as boolean && !isOpen)}
            />
            <ValidityHelperText
                errors={errors} showValidity={showValidity} schema={schema}
            />
        </AccordionDetails>
    </Accordion>
}

// @ts-ignore
export const AccordionStack = extractValidity(memo(AccordionStackBase))

export interface AccordionsRendererProps {
    SummaryTitle?: React.ComponentType<{
        childInvalid: boolean
        valid: boolean
        isOpen: boolean
        schema: StoreSchemaType
        parentSchema: StoreSchemaType | undefined
        storeKeys: StoreKeys
    }>
}

export const AccordionsRendererBase = <W extends WidgetProps<MuiWidgetBinding> = WidgetProps<MuiWidgetBinding>>(
    {
        schema, storeKeys, level,
        errors, showValidity,
        ...props
    }: W
): React.ReactElement => {
    const [open, setOpen] = React.useState<string>(schema.get('defaultExpanded') as string || '')

    const properties = schema.get('properties') as OrderedMap<string, any> | undefined

    return <>
        {properties?.map((childSchema: StoreSchemaType, childKey: KeyType): React.ReactElement =>
            <AccordionStack
                key={childKey}
                {...props}
                schema={childSchema}
                parentSchema={schema}
                storeKeys={storeKeys.push(childKey)}
                level={level + 1}
                isOpen={open === childKey}
                setOpen={setOpen}
            />
        )
            .valueSeq()
            .toArray()}

        <ValidityHelperText
            errors={errors} showValidity={showValidity} schema={schema}
        />
    </>
}

export const AccordionsRenderer = memo(AccordionsRendererBase)
