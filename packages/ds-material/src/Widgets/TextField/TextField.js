import React from 'react';
import TextField from '@material-ui/core/TextField';
import {useUID} from 'react-uid';
import {TransTitle} from '@ui-schema/ui-schema/Translate/TransTitle';
import {mapSchema} from '@ui-schema/ui-schema/Utils/schemaToNative';
import {ValidityHelperText} from '@ui-schema/ds-material/Component/LocaleHelperText/LocaleHelperText';
import {convertStringToNumber} from '@ui-schema/ds-material/Utils/convertStringToNumber';
import {forbidInvalidNumber} from '@ui-schema/ds-material/Utils';
import {schemaTypeIs, schemaTypeIsNumeric} from '@ui-schema/ui-schema/Utils/schemaTypeIs';

export const StringRenderer = ({
                                   type,
                                   multiline, rows, rowsMax,
                                   storeKeys, ownKey, schema, value, onChange,
                                   showValidity, valid, errors, required,
                                   style,
                                   onClick, onFocus, onBlur, onKeyUp, onKeyDown, onKeyPress,
                                   inputProps = {}, InputProps = {}, inputRef: customInputRef,
                               }) => {
    const uid = useUID();
    // todo: this could break law-of-hooks
    const inputRef = customInputRef || React.useRef();

    const format = schema.get('format');

    inputProps = mapSchema(inputProps, schema);

    const hideTitle = schema.getIn(['view', 'hideTitle'])

    return <React.Fragment>
        <TextField
            label={hideTitle ? undefined : <TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/>}
            aria-label={hideTitle ? <TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/> : undefined}
            type={format || type}
            disabled={schema.get('readOnly')}
            multiline={multiline}
            required={required}
            error={!valid && showValidity}
            rows={rows}
            inputRef={inputRef}
            rowsMax={rowsMax}
            fullWidth
            variant={schema.getIn(['view', 'variant'])}
            margin={schema.getIn(['view', 'margin'])}
            size={schema.getIn(['view', 'dense']) ? 'small' : 'medium'}
            value={typeof value === 'string' || typeof value === 'number' ? value : ''}
            onClick={onClick}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyUp={onKeyUp}
            onKeyPress={e => {
                const evt = e.nativeEvent
                if(!forbidInvalidNumber(evt, schema.get('type'))) {
                    onKeyPress && onKeyPress(evt)
                }
            }}
            id={'uis-' + uid}
            style={style}
            onKeyDown={onKeyDown}
            onChange={(e) => {
                const val = e.target.value
                const schemaType = schema.get('type')
                const newVal = convertStringToNumber(val, schemaType)
                if(
                    schemaTypeIsNumeric(schemaType)
                    && newVal === '' && e.target.validity.badInput
                ) {
                    // forbid saving of invalid number at all
                    // deletes invalid number on-change
                    return undefined
                }
                onChange(
                    storeKeys, ['value'],
                    {
                        type: 'update',
                        updater: () => ({value: newVal}),
                        schema,
                        required,
                    },
                )
            }}
            InputLabelProps={{shrink: schema.getIn(['view', 'shrink'])}}
            InputProps={InputProps}
            inputProps={inputProps}
        />

        <ValidityHelperText
            errors={errors} showValidity={showValidity} schema={schema}
        />
    </React.Fragment>
};

export const TextRenderer = ({schema, ...props}) => {
    return <StringRenderer
        {...props}
        schema={schema}
        rows={props.rows || schema.getIn(['view', 'rows'])}
        rowsMax={props.rowsMax || schema.getIn(['view', 'rowsMax'])}
        multiline
    />
};

export const NumberRenderer = (props) => {
    const {schema, inputProps = {}, steps = 'any'} = props
    if(schemaTypeIs(schema.get('type'), 'number') && typeof inputProps['step'] === 'undefined') {
        inputProps['step'] = steps
    }

    return <StringRenderer
        {...props}
        inputProps={inputProps}
        type={'number'}
    />
};
