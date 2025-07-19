import { ValidationErrorsImmutable } from '@ui-schema/ui-schema/ValidatorOutput'
import * as React from 'react'
import { List } from 'immutable'
import Add from '@mui/icons-material/Add'
import Delete from '@mui/icons-material/Delete'
import Box from '@mui/material/Box'
import Slider, { SliderProps, SliderThumb } from '@mui/material/Slider'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { Translate } from '@ui-schema/react/Translate'
import { TranslateTitle } from '@ui-schema/react/TranslateTitle'
import { memo } from '@ui-schema/react/Utils/memo'
import { extractValue, WithOnChange, WithValuePlain } from '@ui-schema/react/UIStore'
import { schemaTypeIs, schemaTypeIsNumeric } from '@ui-schema/ui-schema/schemaTypeIs'
import { ValidityHelperText } from '@ui-schema/ds-material/Component/LocaleHelperText'
import { AccessTooltipIcon } from '@ui-schema/ds-material/Component/Tooltip'
import { WidgetProps } from '@ui-schema/react/Widget'
import { SchemaTypesType } from '@ui-schema/ui-schema/CommonTypings'
import { StoreKeys } from '@ui-schema/ui-schema/ValueStore'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'

const ThumbComponent = ({onDelete, canDelete, children, ...p}) => {
    const [hover, setHover] = React.useState(false)
    return <SliderThumb
        {...p}
        onFocus={onDelete ? () => setHover(true) : undefined}
        onBlur={onDelete ? () => setHover(false) : undefined}
        onMouseEnter={onDelete ? () => setHover(true) : undefined}
        onMouseLeave={onDelete ? () => setHover(false) : undefined}
    >
        {children}

        {onDelete && canDelete && (hover || -1 !== p.className.indexOf('-active')) ?
            <IconButton
                size={'small'}
                style={{position: 'absolute', zIndex: 100, bottom: -30, padding: 6}}
                onClick={() => onDelete(p['data-index'])}>
                <Delete fontSize={'inherit'}/>
            </IconButton> : null}
    </SliderThumb>
}

const NumberSliderRenderer: React.FC<{
    multipleOf?: number
    min?: number
    max?: number
    minItems?: number
    maxItems?: number
    enumVal?: List<number>
    constVal?: number | List<number>
    defaultVal?: number | List<number>
    storeKeys: StoreKeys
    schema: UISchemaMap
    showValidity?: boolean
    valid?: boolean
    errors?: ValidationErrorsImmutable
    required?: boolean
} & WithValuePlain & WithOnChange> = (
    {
        multipleOf, min, max, enumVal, constVal, defaultVal,
        storeKeys, schema, value, onChange,
        showValidity, valid, errors, required,
        minItems, maxItems,
    },
) => {
    const uid = React.useId()
    const type = schema.get('type')
    let hasMulti = false
    let canAdd = false
    const listMode = schemaTypeIs(type, 'array') || (!type && List.isList(value))
    if (listMode) {
        hasMulti = typeof maxItems === 'undefined' || (minItems as number) < maxItems
        canAdd = typeof maxItems === 'undefined' || (!List.isList(value) || (List.isList(value) && value.size < maxItems))
    }

    const marksLabel = schema.getIn(['view', 'marksLabel'])
    const valuetext = React.useCallback((valueSingle) => {
        if (!marksLabel) return valueSingle
        return `${valueSingle}${marksLabel}`
    }, [marksLabel])

    let marksValues = constVal
    if (typeof marksValues !== 'number' && !List.isList(marksValues)) {
        marksValues = enumVal
        if (!List.isList(marksValues)) {
            marksValues = schema.getIn(['view', 'marks']) as List<number>
        }
    }

    const marks: any[] = []
    if (typeof marksValues !== 'undefined') {
        if (typeof marksValues === 'number') {
            marks.push({value: marksValues, label: valuetext(marksValues)})
        } else if (List.isList(marksValues)) {
            marksValues.forEach(markValue => {
                marks.push({value: markValue, label: valuetext(markValue)})
            })
        }
    }

    return <React.Fragment>
        <Typography id={'uis-' + uid} gutterBottom color={!valid && showValidity ? 'error' : undefined}>
            <TranslateTitle schema={schema} storeKeys={storeKeys}/>{required ? ' *' : null}
        </Typography>

        <Box style={{display: 'flex'}} mt={schema.get('view')?.get('mt')} mb={schema.get('view')?.get('mb')}>
            <Slider
                getAriaValueText={valuetext}
                aria-labelledby={'uis-' + uid}
                valueLabelDisplay={schema.getIn(['view', 'tooltip']) as SliderProps['valueLabelDisplay']}
                step={typeof enumVal !== 'undefined' || typeof constVal !== 'undefined' ? null : multipleOf}
                track={schema.getIn(['view', 'track']) as SliderProps['track']}
                marks={marks.length ? marks : schema.getIn(['view', 'marks']) as SliderProps['marks']}
                size={schema.getIn(['view', 'size']) as SliderProps['size']}
                min={min}
                max={max}
                slots={{
                    thumb: ThumbComponent,
                }}
                /*components={{
                    Thumb: hasMulti ? p => <ThumbComponent
                        {...p}
                        onClick={(index) =>
                            onChange({
                                storeKeys,
                                scopes: ['value'],
                                type: 'update',
                                updater: ({value: storeValue}) => ({value: storeValue.splice(index, 1)}),
                                schema,
                                required,
                            })
                        }
                        canDelete={value && value.size > minItems}
                    /> : ThumbComponent,
                }}*/
                slotProps={{
                    thumb: {
                        // @ts-expect-error custom thumb feature
                        onDelete: hasMulti ? (index) =>
                            onChange({
                                storeKeys,
                                scopes: ['value'],
                                type: 'update',
                                updater: ({value: storeValue}) => ({value: storeValue.splice(index, 1)}),
                                schema,
                                required,
                            }) : undefined,
                        canDelete: Boolean(hasMulti && value && List.isList(value) && (value.size > (minItems as number))),
                    },
                }}
                value={(listMode ?
                    value && List.isList(value) && value.size ? value.toJS() as number[] : List.isList(defaultVal) ? defaultVal.toJS() as number[] : defaultVal :
                    typeof value === 'number' ? value : List.isList(defaultVal) ? defaultVal.toJS() as number[] : defaultVal)}
                onChange={(e, newValue) => {
                    if (!listMode && isNaN(newValue as number * 1)) {
                        console.error('Invalid Type: input not a number in:', e.target, newValue)
                        return
                    }
                    if (schema.get('readOnly')) {
                        return
                    }
                    onChange({
                        storeKeys,
                        scopes: ['value'],
                        type: 'update',
                        // @ts-ignore
                        updater: () => ({value: listMode ? List(newValue) : newValue * 1}),
                        schema,
                        required,
                    })
                }}
            />
            {!schema.get('readOnly') && hasMulti ?
                <IconButton
                    size={'small'} disabled={!canAdd} style={{margin: 'auto 6px'}}
                    onClick={() =>
                        onChange({
                            storeKeys,
                            scopes: ['value'],
                            type: 'update',
                            // @ts-ignore
                            updater: ({value: storeValue}) => ({value: storeValue ? storeValue.push(min) : List(defaultVal).push(min)}),
                            schema,
                            required,
                        })
                    }
                >
                    <AccessTooltipIcon title={<Translate text={'labels.add-number'}/>}>
                        <Add fontSize={'inherit'}/>
                    </AccessTooltipIcon>
                </IconButton> : null}
        </Box>

        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </React.Fragment>
}

const ValueNumberSliderRenderer = extractValue(memo(NumberSliderRenderer))

export const NumberSlider = (
    {
        schema, ...props
    }: WidgetProps,
): React.ReactElement => {
    const {value} = props
    const type = schema.get('type')
    const listMode = schemaTypeIs(type, 'array') || (!type && List.isList(value))
    let min: number = 0
    let max: number = 100
    let defaultVal
    let multipleOf: number | undefined = undefined
    let minItems: number | undefined = undefined
    let maxItems: number | undefined = undefined
    if (listMode) {
        if (!schemaTypeIsNumeric(schema.getIn(['items', 'type']) as SchemaTypesType)) {
            return null as unknown as React.ReactElement
        }

        min = typeof schema.getIn(['items', 'minimum']) === 'number' ? schema.getIn(['items', 'minimum']) as number :
            typeof schema.getIn(['items', 'exclusiveMinimum']) === 'number' ? schema.getIn(['items', 'exclusiveMinimum']) as number + 1 : min as number
        max = typeof schema.getIn(['items', 'maximum']) === 'number' ? schema.getIn(['items', 'maximum']) as number :
            typeof schema.getIn(['items', 'exclusiveMaximum']) === 'number' ? schema.getIn(['items', 'exclusiveMaximum']) as number - 1 : max as number
        multipleOf = schema.getIn(['items', 'multipleOf']) as number

        minItems = schema.get('minItems')
        maxItems = schema.get('maxItems')
        if ((minItems as number) < 2 || !minItems) {
            minItems = 2
        }
        defaultVal = new Array(minItems).fill(null).map(() => min)
        if (schema.getIn(['view', 'track']) === 'inverted') {
            defaultVal[defaultVal.length - 1] = max
        }
    } else {
        min = typeof schema.get('minimum') === 'number' ? schema.get('minimum') as number :
            typeof schema.get('exclusiveMinimum') === 'number' ? schema.get('exclusiveMinimum') as number + 1 : min as number
        max = typeof schema.get('maximum') === 'number' ? schema.get('maximum') as number :
            typeof schema.get('exclusiveMaximum') === 'number' ? schema.get('exclusiveMaximum') as number - 1 : max as number
        multipleOf = schema.get('multipleOf')
        defaultVal = min
    }

    // todo: happy-path issue with multiple types: `array | number | integer`, will always select array component
    const Component = listMode ? ValueNumberSliderRenderer : NumberSliderRenderer

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
}
