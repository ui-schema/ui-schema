import React from 'react'
import { useUID } from 'react-uid'
import { OwnKey, StoreSchemaType, TransTitle, WidgetProps, PluginStack, memo, ValidatorErrorsType } from '@ui-schema/ui-schema'
import { ValidityHelperText } from '@ui-schema/ds-material/Component/LocaleHelperText/LocaleHelperText'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

export interface AccordionStackBaseProps {
    isOpen: boolean
    setOpen: (handler: (ownKey: string) => string) => void
}

const AccordionStackBase: React.ComponentType<WidgetProps & AccordionStackBaseProps> = (props) => {
    const uid = useUID()
    const {
        storeKeys, schema,
        parentSchema, ownKey,
        showValidity, level,
        isOpen, setOpen,
    } = props
    const [errors, setErrors] = React.useState<ValidatorErrorsType | undefined>()

    return <Accordion
        style={{width: '100%'}} expanded={isOpen}
        onChange={() => setOpen(k => k === ownKey ? '' : ownKey as string)}
    >
        <AccordionSummary
            expandIcon={<ExpandMoreIcon/>}
            id={'uis-' + uid}
        >
            <Typography>
                <TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/>
            </Typography>
        </AccordionSummary>
        <AccordionDetails>
            <PluginStack
                {...props}
                schema={schema}
                parentSchema={parentSchema}
                storeKeys={storeKeys} level={level}
                onErrors={setErrors}
                isVirtual={props.isVirtual || (parentSchema.get('onClosedHidden') && !isOpen)}
            />
            <ValidityHelperText
                errors={errors} showValidity={showValidity} schema={schema}
            />
        </AccordionDetails>
    </Accordion>
}

export const AccordionStack = memo(AccordionStackBase)

export const AccordionsRendererBase = (
    {
        schema, storeKeys, level,
        errors, showValidity,
        ...props
    }: WidgetProps
): React.ReactElement => {
    const [open, setOpen] = React.useState<string>(schema.get('defaultExpanded') as string || '')

    const properties = schema.get('properties')

    return <>
        {properties ?
            // @ts-ignore
            properties.map((childSchema: StoreSchemaType, childKey: OwnKey): React.ReactElement =>
                // @ts-ignore
                <AccordionStack
                    key={childKey}
                    {...props}
                    schema={childSchema}
                    ownKey={childKey}
                    parentSchema={schema}
                    storeKeys={storeKeys.push(childKey)}
                    level={level + 1}
                    isOpen={open === childKey}
                    setOpen={setOpen}
                />
            )
                .valueSeq()
                .toArray()
            : null}

        <ValidityHelperText
            errors={errors} showValidity={showValidity} schema={schema}
        />
    </>
}

export const AccordionsRenderer = memo(AccordionsRendererBase)
