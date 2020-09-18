import React from "react";
import {List} from "immutable";
import Add from "@material-ui/icons/Add";
import Delete from "@material-ui/icons/Delete";
import Box from "@material-ui/core/Box";
import Slider from "@material-ui/core/Slider";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import {TransTitle, extractValue, memo, updateValue} from "@ui-schema/ui-schema";
import {ValidityHelperText} from "../../Component/LocaleHelperText/LocaleHelperText";
import {AccessTooltipIcon} from "../../Component/Tooltip/Tooltip";

const ThumbComponent = ({onClick, canDelete, children, ...p}) => {
    return <span {...p}>
        {children}

        {canDelete && -1 !== p.className.indexOf('-open') ? <IconButton
            size={'small'}
            style={{position: 'absolute', zIndex: 100, bottom: -30}}
            onClick={() => onClick(p['data-index'])}>
            <Delete fontSize={'inherit'}/>
        </IconButton> : null}
    </span>
};

const NumberSliderRenderer = ({
                                  multipleOf, min, max, enumVal, constVal, defaultVal,
                                  storeKeys, ownKey, schema, value, onChange,
                                  showValidity, valid, errors, required,
                                  minItems, maxItems,
                              }) => {
    let hasMulti = false;
    let canAdd = false;
    if(schema.get('type') === 'array') {
        hasMulti = typeof maxItems === 'undefined' || minItems < maxItems;
        canAdd = typeof maxItems === 'undefined' || (!List.isList(value) || (List.isList(value) && value.size < maxItems));
    }

    const marksLabel = schema.getIn(['view', 'marksLabel']);
    const valuetext = React.useCallback((value) => {
        if(!marksLabel) return value;
        return `${value}${marksLabel}`;
    }, [marksLabel]);

    let marksValues = constVal;
    if(typeof marksValues !== 'number' && !List.isList(marksValues)) {
        marksValues = enumVal;
        if(!List.isList(marksValues)) {
            marksValues = schema.getIn(['view', 'marks']);
        }
    }

    const marks = [];
    if(typeof marksValues !== 'undefined') {
        if(typeof marksValues === 'number') {
            marks.push({value: marksValues, label: valuetext(marksValues)});
        } else if(List.isList(marksValues)) {
            marksValues.forEach(value => {
                marks.push({value, label: valuetext(value)});
            });
        }
    }

    return <React.Fragment>
        <Typography id={"discrete-slider-" + ownKey} gutterBottom color={!valid && showValidity ? 'error' : 'initial'}>
            <TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/>{required ? ' *' : null}
        </Typography>

        <Box style={{display: 'flex'}} mt={schema.getIn(['view', 'mt'])} mb={schema.getIn(['view', 'mb'])}>
            <Slider
                getAriaValueText={valuetext}
                aria-labelledby={"discrete-slider-" + ownKey}
                valueLabelDisplay={schema.getIn(['view', 'tooltip'])}
                step={typeof enumVal !== 'undefined' || typeof constVal !== 'undefined' ? null : multipleOf}
                track={schema.getIn(['view', 'track'])}
                marks={marks.length ? marks : schema.getIn(['view', 'marks'])}
                min={min}
                max={max}
                ThumbComponent={hasMulti ? p => <ThumbComponent
                    {...p}
                    onClick={(index) => onChange(updateValue(storeKeys, value.splice(index, 1), required, schema.get('type')))}
                    canDelete={value && value.size > minItems}
                /> : undefined}
                value={(schema.get('type') === 'array' ?
                    value && value.size ? value.toJS() : defaultVal :
                    typeof value === 'number' ? value : defaultVal)}
                onChange={(e, value) => {
                    if(schema.get('type') === 'array') {
                        onChange(updateValue(storeKeys, List(value), required, schema.get('type')));
                    } else {
                        if(isNaN(value * 1)) {
                            console.error('Invalid Type: input not a number in:', e.target, value);
                            return;
                        }
                        onChange(updateValue(storeKeys, value * 1, required, schema.get('type')));
                    }
                }}
            />
            {hasMulti ? <IconButton
                size={'small'} disabled={!canAdd} style={{margin: 'auto 6px'}}
                onClick={() => onChange(updateValue(storeKeys, value ? value.push(min) : List(defaultVal).push(min), required, schema.get('type')))}
            >
                <AccessTooltipIcon title={'Add Number'}>
                    <Add fontSize={'inherit'}/>
                </AccessTooltipIcon>
            </IconButton> : null}
        </Box>

        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </React.Fragment>
};

const ValueNumberSliderRenderer = extractValue(memo(NumberSliderRenderer));

export const NumberSlider = ({
                          schema, ...props
                      }) => {
    let min = 0;
    let max = 100;
    let defaultVal = min;
    let multipleOf = undefined;
    let minItems = undefined;
    let maxItems = undefined;
    if(schema.get('type') === 'array') {
        if(schema.getIn(['items', 'type']) !== 'number') {
            return null
        }

        min = typeof schema.getIn(['items', 'minimum']) === 'number' ? schema.getIn(['items', 'minimum']) :
            typeof schema.getIn(['items', 'exclusiveMinimum']) === 'number' ? schema.getIn(['items', 'exclusiveMinimum']) + 1 : min;
        max = typeof schema.getIn(['items', 'maximum']) === 'number' ? schema.getIn(['items', 'maximum']) :
            typeof schema.getIn(['items', 'exclusiveMaximum']) === 'number' ? schema.getIn(['items', 'exclusiveMaximum']) - 1 : max;
        multipleOf = schema.getIn(['items', 'multipleOf']);

        minItems = schema.get('minItems');
        maxItems = schema.get('maxItems');
        if(minItems < 2 || !minItems) {
            minItems = 2;
        }
        defaultVal = new Array(minItems).fill(null).map(() => min);
        if(schema.getIn(['view', 'track']) === 'inverted') {
            defaultVal[defaultVal.length - 1] = max;
        }
    } else {
        min = typeof schema.get('minimum') === 'number' ? schema.get('minimum') :
            typeof schema.get('exclusiveMinimum') === 'number' ? schema.get('exclusiveMinimum') + 1 : min;
        max = typeof schema.get('maximum') === 'number' ? schema.get('maximum') :
            typeof schema.get('exclusiveMaximum') === 'number' ? schema.get('exclusiveMaximum') - 1 : max;
        multipleOf = schema.get('multipleOf');
        defaultVal = min;
    }

    const Component = schema.get('type') === 'array' ? ValueNumberSliderRenderer : NumberSliderRenderer;

    return <Component
        multipleOf={multipleOf}
        min={min}
        max={max}
        minItems={minItems}
        maxItems={maxItems}
        enumVal={schema.get('enum')}
        constVal={schema.get('const')}
        defaultVal={defaultVal}
        schema={schema}
        {...props}
    />
};
