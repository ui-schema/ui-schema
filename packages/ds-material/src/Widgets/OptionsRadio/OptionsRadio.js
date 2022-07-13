import React from 'react';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import {Translate} from '@ui-schema/react/Translate';
import {TranslateTitle} from '@ui-schema/react/TranslateTitle';
import {ValidityHelperText} from '@ui-schema/ds-material/Component/LocaleHelperText';
import {useOptionsFromSchema} from '@ui-schema/ds-material/Utils'

const OptionsRadio = ({
                          schema, value, onChange, storeKeys, showValidity, valid, required, errors,
                          row, widgets,
                      }) => {
    const {valueSchemas} = useOptionsFromSchema(storeKeys, schema)

    const activeValue = typeof value !== 'undefined' ? value : (schema.get('default') || '');

    const InfoRenderer = widgets?.InfoRenderer
    return <FormControl
        required={required} error={!valid && showValidity} component="fieldset" fullWidth
        size={schema.getIn(['view', 'dense']) ? 'small' : undefined}
        disabled={schema.get('readOnly')}
    >
        <FormLabel component="legend" style={{width: '100%'}}>
            <TranslateTitle schema={schema} storeKeys={storeKeys}/>
            {InfoRenderer && schema?.get('info') ?
                <InfoRenderer
                    schema={schema} variant={'icon'} openAs={'modal'}
                    storeKeys={storeKeys} valid={valid} errors={errors}
                    align={'right'} dense
                /> :
                undefined}
        </FormLabel>
        <RadioGroup row={row} disabled={schema.get('readOnly')}>
            {valueSchemas?.map(({value, text, fallback, context, schema}, i) =>
                <FormControlLabel
                    key={i}
                    control={<Radio
                        value={value}
                        checked={value === activeValue}
                        onChange={() =>
                            !schema?.get('readOnly') &&
                            onChange({
                                storeKeys,
                                scopes: ['value'],
                                type: 'set',
                                schema,
                                required,
                                data: {value: value},
                            })
                        }
                    />}
                    label={<Translate
                        schema={schema?.get('t')}
                        text={text}
                        context={context}
                        fallback={fallback}
                    />}
                />,
            ).valueSeq()}
        </RadioGroup>

        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </FormControl>
};

export {OptionsRadio};
