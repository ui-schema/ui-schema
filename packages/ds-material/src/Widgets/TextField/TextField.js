import React from 'react';
import TextField from '@material-ui/core/TextField';
import {useUID} from 'react-uid';
import {TransTitle, mapSchema, checkNativeValidity} from '@ui-schema/ui-schema';
import {ValidityHelperText} from '../../Component/LocaleHelperText/LocaleHelperText';
import {convertStringToNumber} from '@ui-schema/ds-material/Utils/convertStringToNumber';
import {forbidInvalidNumber} from '@ui-schema/ds-material/Utils';

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
    const currentRef = inputRef.current;

    inputProps = mapSchema(inputProps, schema);

    if(schema.get('type') === 'number' && typeof inputProps['step'] === 'undefined') {
        inputProps['step'] = 'any'
    }

    if(schema.get('checkNativeValidity')) {
        valid = checkNativeValidity(currentRef, valid);
    }

    React.useEffect(() => {
        if(currentRef) {
            onChange(storeKeys, ['valid'], () => ({valid: valid}))
        }
    }, [onChange, storeKeys, valid]);

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
            value={typeof value !== 'undefined' ? value : ''}
            onClick={onClick}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyUp={onKeyUp}
            onKeyPress={e => {
                const evt = e.nativeEvent
                if (!forbidInvalidNumber(evt, schema.get('type'))) {
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
                    (schemaType === 'number' || schemaType === 'integer')
                    && newVal === '' && e.target.validity.badInput
                ) {
                    // forbid saving of invalid number at all
                    // deletes invalid number on-change
                    return undefined
                }
                onChange(
                    storeKeys, ['value'],
                    () => ({value: newVal}),
                    schema.get('deleteOnEmpty') || required,
                    schema.get('type'),
                )
            }}
            InputLabelProps={{shrink: schema.getIn(['view', 'shrink'])}}
            InputProps={InputProps}
            inputProps={inputProps}
        />

        <ValidityHelperText
            errors={errors} showValidity={showValidity} schema={schema}
            browserError={currentRef ? currentRef.validationMessage : ''}
        />
    </React.Fragment>
};

export const TextRenderer = ({schema, ...props}) => {
    return <StringRenderer
        {...props}
        schema={schema}
        rows={schema.getIn(['view', 'rows'])}
        rowsMax={schema.getIn(['view', 'rowsMax'])}
        multiline
    />
};

export const NumberRenderer = (props) => {
    return <StringRenderer
        {...props}
        type={'number'}
    />
};
