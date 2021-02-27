import React from 'react';
import TextField from '@material-ui/core/TextField';
import {useUID} from 'react-uid';
import {TransTitle, mapSchema, checkNativeValidity} from '@ui-schema/ui-schema';
import {ValidityHelperText} from '../../Component/LocaleHelperText/LocaleHelperText';

export const convertStringToNumber = (value, type) => {
    if(type === 'number') {
        if(isNaN(value * 1)) {
            console.error('Invalid Type: input not a number in');
            return;
        }
        return value === '' ? '' : value * 1
    }
    return value
}

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
    valid = checkNativeValidity(currentRef, valid);

    React.useEffect(() => {
        if(currentRef) {
            onChange(storeKeys, ['valid'], () => ({valid: valid}))
        }
        // todo: aren't `storeKeys` missing in deps?
    }, [onChange, valid]);

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
            onKeyPress={onKeyPress}
            id={'uis-' + uid}
            style={style}
            onKeyDown={onKeyDown}
            onChange={(e) => {
                const val = e.target.value
                onChange(
                    storeKeys, ['value'],
                    () => ({value: convertStringToNumber(val, schema.get('type'))}),
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
