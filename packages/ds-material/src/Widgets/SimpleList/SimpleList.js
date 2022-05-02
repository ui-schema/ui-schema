import React from 'react';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import FormLabel from '@mui/material/FormLabel';
import IconButton from '@mui/material/IconButton';
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';
import {TransTitle, extractValue, memo, PluginStack} from '@ui-schema/ui-schema';
import {ValidityHelperText} from '@ui-schema/ds-material/Component/LocaleHelperText';
import {AccessTooltipIcon} from '@ui-schema/ds-material/Component/Tooltip';
import {ListButton} from '@ui-schema/ds-material/Component/ListButton';
import {Trans} from '@ui-schema/ui-schema/Translate/Trans';
import {Map} from 'immutable';

export const SimpleListItemBase = (
    {
        showValidity, schema, schemaKeys, storeKeys, notDeletable,
        readOnly, required, onChange, level, index,
    },
) => {
    return <Grid key={index} item xs={12} style={{display: 'flex'}}>
        <div style={{display: 'flex', flexDirection: 'column', flexGrow: 2}}>
            <PluginStack
                showValidity={showValidity} noGrid
                schema={schema.get('items')} parentSchema={schema}
                storeKeys={storeKeys.push(index)} level={level + 1}
                schemaKeys={schemaKeys?.push('items')}
            />
        </div>

        {!readOnly && !notDeletable ?
            <IconButton
                onClick={() => {
                    onChange({
                        storeKeys,
                        scopes: ['value', 'internal'],
                        type: 'list-item-delete',
                        index: index,
                        schema,
                        required,
                    })
                }}
                size={'small'}
                style={{margin: 'auto 6px', flexShrink: 0}}
            >
                <AccessTooltipIcon title={<Trans text={'labels.remove-entry'}/>}>
                    <Remove fontSize={'inherit'} style={{margin: 2}}/>
                </AccessTooltipIcon>
            </IconButton> : null}
    </Grid>
}
export const SimpleListItem = memo(SimpleListItemBase)

export const SimpleListInner = (
    {
        schemaKeys, storeKeys, ownKey, schema, listSize, onChange,
        showValidity, valid, errors, required, level,
        widgets,
        btnAddShowLabel, btnAddStyle,
        btnSize: btnSizeProp,
        btnVariant: btnVariantProp,
        btnColor: btnColorProp,
    },
) => {
    const btnSize = (schema.getIn(['view', 'btnSize']) || btnSizeProp || 'small')
    const btnVariant = (schema.getIn(['view', 'btnVariant']) || btnVariantProp || undefined)
    const btnColor = (schema.getIn(['view', 'btnColor']) || btnColorProp || undefined)
    const notAddable = schema.get('notAddable')
    const notDeletable = schema.get('notDeletable')
    const readOnly = schema.get('readOnly')
    const InfoRenderer = widgets?.InfoRenderer
    return <FormControl required={required} error={!valid && showValidity} component="fieldset" style={{width: '100%'}}>
        <Grid container spacing={2}>
            {!schema.getIn(['view', 'hideTitle']) ? <Grid item xs={12}>
                <FormLabel component="legend"><TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/></FormLabel>
            </Grid> : null}

            {InfoRenderer && schema?.get('info') ?
                <Grid item xs={12}>
                    <InfoRenderer
                        schema={schema} variant={'preview'} openAs={'embed'}
                        storeKeys={storeKeys} valid={valid} errors={errors}
                    />
                </Grid> :
                undefined}

            {Array.from(Array(listSize || 0)).map((itemVal, i) =>
                <SimpleListItem
                    key={i}
                    index={i}
                    showValidity={showValidity}
                    schema={schema}
                    storeKeys={storeKeys}
                    schemaKeys={schemaKeys}
                    btnSize={btnSize}
                    level={level}
                    notDeletable={notDeletable}
                    readOnly={readOnly}
                    required={required}
                    onChange={onChange}
                />)}

            <Grid item xs={12}>
                {!readOnly && !notAddable ?
                    <ListButton
                        onClick={() => {
                            onChange({
                                storeKeys,
                                scopes: ['value', 'internal'],
                                type: 'list-item-add',
                                schema,
                                required,
                            })
                        }}
                        btnSize={btnSize}
                        btnVariant={btnVariant}
                        btnColor={btnColor}
                        showLabel={btnAddShowLabel}
                        style={btnAddStyle}
                        Icon={Add}
                        title={
                            <Trans
                                text={'labels.add-entry'}
                                context={Map({actionLabels: schema.get('tableActionLabels')})}
                            />
                        }
                    /> : null}

                <ValidityHelperText
                    /* only pass down errors which are not for a specific sub-schema */
                    errors={errors}
                    showValidity={showValidity}
                    schema={schema}
                />
            </Grid>
        </Grid>
    </FormControl>
}
export const SimpleListBase = memo(SimpleListInner)

export const SimpleListWrapper = ({
                                      value,
                                      // eslint-disable-next-line no-unused-vars
                                      internalValue,
                                      ...props
                                  }) => {
    return <SimpleListBase listSize={value?.size} {...props}/>
}
export const SimpleList = extractValue(SimpleListWrapper)
