import React from 'react';

import {TransTitle, WidgetRenderer} from '@ui-schema/ui-schema';
import {ValidityHelperText} from '../../Component/LocaleHelperText/LocaleHelperText';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export const AccordionsRenderer = ({
                                  schema, storeKeys,
                                  showValidity, errors, level, ...props
                              }) => {
    const properties = schema.get('properties');

    return properties ? properties.map((childSchema, childKey) =>
        <Accordion key={childKey} style={{width: '100%'}}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography>
                    <TransTitle schema={childSchema} storeKeys={storeKeys.push(childKey)} ownKey={childKey}/>
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <WidgetRenderer
                    {...props}
                    schema={childSchema} parentSchema={schema}
                    ownKey={childKey}
                    storeKeys={storeKeys.push(childKey)} level={level + 1}
                />
                <ValidityHelperText
                    errors={errors} showValidity={showValidity} schema={schema}
                />
            </AccordionDetails>
        </Accordion>,
    ).valueSeq() : null
};
