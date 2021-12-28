import React from 'react';
import {
    FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox,
} from '@material-ui/core';
import {Map, List} from 'immutable';
import {TransTitle, Trans, beautifyKey, extractValue, memo} from '@ui-schema/ui-schema';
import {useUID} from 'react-uid';
import {ValidityHelperText} from '@ui-schema/ds-material/Component/LocaleHelperText/LocaleHelperText';
import {sortScalarList} from '@ui-schema/ui-schema/Utils/sortScalarList';
import {getTranslatableEnum} from '@ui-schema/ui-schema/Translate';

const OptionCheck = ({disabled, currentValue, label, onChange}) => {
    const uid = useUID();

    return <FormControlLabel
        id={'uis-' + uid}
        control={<Checkbox
            id={'uis-' + uid}
            value={currentValue}
            checked={currentValue}
            onChange={onChange}
            disabled={disabled}
        />}
        disabled={disabled}
        label={label}
    />;
};

const checkActive = (list, name) => list && list.contains && typeof list.contains(name) !== 'undefined' ? list.contains(name) : false;

const OptionsCheckValue = extractValue(memo(({
                                                 enumVal, storeKeys, value, onChange, trans, tt,
                                                 required, schema, disabled,
                                             }) =>
    enumVal ?
        enumVal.map((enum_name) => {
            const isActive = checkActive(value, enum_name)

            const relativeT = List(['enum', getTranslatableEnum(enum_name)]);

            return <OptionCheck
                key={enum_name}
                currentValue={isActive}
                disabled={disabled}
                onChange={() => {
                    onChange({
                        storeKeys,
                        scopes: ['value'],
                        type: 'update',
                        updater: ({value: val = List()}) => ({
                            value: sortScalarList(checkActive(val, enum_name) ?
                                val.delete(val.indexOf(enum_name)) :
                                val.push(enum_name)),
                        }),
                        schema,
                        required,
                    })
                }}
                label={<Trans
                    schema={trans}
                    text={storeKeys.insert(0, 'widget').concat(relativeT).join('.')}
                    context={Map({'relative': relativeT})}
                    fallback={beautifyKey(getTranslatableEnum(enum_name), tt)}
                />}
            />
        }).valueSeq()
        : null,
));

export const OptionsCheck = ({
                                 ownKey, schema, storeKeys, showValidity, valid, required, errors,
                                 row, widgets,
                             }) => {
    const enumVal = schema.get('enum');
    if(!enumVal) return null;
    const InfoRenderer = widgets?.InfoRenderer
    return <FormControl required={required} error={!valid && showValidity} component="fieldset">
        <FormLabel component="legend" style={{width: '100%'}}>
            <TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/>
            {InfoRenderer && schema?.get('info') ?
                <InfoRenderer
                    schema={schema} variant={'icon'} openAs={'modal'}
                    storeKeys={storeKeys} valid={valid} errors={errors}
                    align={'right'} dense
                /> :
                undefined}
        </FormLabel>
        <FormGroup row={row}>
            <OptionsCheckValue
                enumVal={enumVal} storeKeys={storeKeys}
                trans={schema.get('t')} tt={schema.get('ttEnum')}
                required={required} schema={schema}
                disabled={schema.get('readOnly')}
            />
        </FormGroup>

        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </FormControl>;
};
