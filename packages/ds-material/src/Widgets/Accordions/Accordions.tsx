import React from 'react'
import { useUID } from 'react-uid'
import { OwnKey, StoreSchemaType, TransTitle, WidgetProps, PluginStack, memo, extractValidity, WithValue } from '@ui-schema/ui-schema'
import { ValidityHelperText } from '../../Component/LocaleHelperText/LocaleHelperText'

import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

let AccordionStack: React.ComponentType<WidgetProps> = (props) => {
    const uid = useUID()
    const {
        storeKeys, schema,
        parentSchema, ownKey,
        showValidity, errors, level,
    } = props

    return <Accordion style={{width: '100%'}}>
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
                // passing down schema without `widget`,
                // otherwise we got an endless recursion
                schema={schema}
                parentSchema={parentSchema}
                storeKeys={storeKeys} level={level}
            />
            <ValidityHelperText
                errors={errors} showValidity={showValidity} schema={schema}
            />
        </AccordionDetails>
    </Accordion>
}

// @ts-ignore
AccordionStack = extractValidity(memo(AccordionStack))
export { AccordionStack }

export const AccordionsRenderer = (
    {
        schema, storeKeys, level,
        errors, showValidity,
        // extracting internalValue from props, performance optimize
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        internalValue,
        ...props
    }: WidgetProps & WithValue
): React.ReactElement => {
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
