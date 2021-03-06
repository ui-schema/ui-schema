import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import IconButton from '@material-ui/core/IconButton';
import Add from '@material-ui/icons/Add';
import Remove from '@material-ui/icons/Remove';
import {TransTitle, extractValue, memo, PluginStack} from '@ui-schema/ui-schema';
import {ValidityHelperText} from '../../Component/LocaleHelperText/LocaleHelperText';
import {List} from 'immutable';
import {AccessTooltipIcon} from '../../Component/Tooltip/Tooltip';
import {Trans} from '@ui-schema/ui-schema/Translate/Trans';

const SimpleList = extractValue(memo(({
                                          storeKeys, ownKey, schema, value, onChange,
                                          showValidity, valid, errors, required, level,
                                      }) => {
    const btnSize = schema.getIn(['view', 'btnSize']) || 'small';

    return <FormControl required={required} error={!valid && showValidity} component="fieldset" style={{width: '100%'}}>
        <Grid container spacing={2}>
            {!schema.getIn(['view', 'hideTitle']) ? <Grid item xs={12}>
                <FormLabel component="legend"><TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/></FormLabel>
            </Grid> : null}

            {value ? value.map((val, i) =>
                <Grid key={i} item xs={12} style={{display: 'flex'}}>
                    <div style={{display: 'flex', flexDirection: 'column', flexGrow: 2}}>
                        <PluginStack
                            showValidity={showValidity} noGrid
                            schema={schema.get('items')} parentSchema={schema}
                            storeKeys={storeKeys.push(i)} level={level + 1}
                        />
                    </div>

                    <IconButton
                        onClick={() => {
                            onChange(
                                storeKeys, ['value'],
                                ({value: val}) => ({value: val.splice(i, 1)}),
                                schema.get('deleteOnEmpty') || required,
                                schema.get('type'),
                            )
                        }}
                        disabled={schema.get('readOnly')}
                        size={btnSize}
                        style={{margin: 'auto 6px', flexShrink: 0}}
                    >
                        <AccessTooltipIcon title={<Trans text={'labels.remove-entry'}/>}>
                            <Remove fontSize={'inherit'}/>
                        </AccessTooltipIcon>
                    </IconButton>
                </Grid>,
            ).valueSeq() : null}

            <Grid item xs={12}>
                <IconButton
                    onClick={() => {
                        onChange(
                            storeKeys, ['value'],
                            ({value: val = List()}) => ({
                                value: schema.get('type') === 'string' ? val.push('') : val.push(undefined),
                            }),
                            schema.get('deleteOnEmpty') || required,
                            schema.get('type'),
                        )
                    }}
                    disabled={schema.get('readOnly')}
                    size={btnSize}
                >
                    <AccessTooltipIcon title={<Trans text={'labels.add-entry'}/>}>
                        <Add fontSize={'inherit'}/>
                    </AccessTooltipIcon>
                </IconButton>

                <ValidityHelperText
                    /* only pass down errors which are not for a specific sub-schema */
                    errors={errors}
                    showValidity={showValidity}
                    schema={schema}
                />
            </Grid>
        </Grid>
    </FormControl>
}));

export {SimpleList};
