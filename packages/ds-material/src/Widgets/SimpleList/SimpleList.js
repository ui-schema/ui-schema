import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import IconButton from '@material-ui/core/IconButton';
import Add from '@material-ui/icons/Add';
import Remove from '@material-ui/icons/Remove';
import {TransTitle, extractValue, memo, PluginStack} from '@ui-schema/ui-schema';
import {ValidityHelperText} from '@ui-schema/ds-material/Component/LocaleHelperText/LocaleHelperText';
import {AccessTooltipIcon} from '@ui-schema/ds-material/Component/Tooltip/Tooltip';
import {Trans} from '@ui-schema/ui-schema/Translate/Trans';

let SimpleListItem = (
    {showValidity, schema, storeKeys, notDeletable, btnSize, readOnly, required, onChange, level, index},
) => {
    return <Grid key={index} item xs={12} style={{display: 'flex'}}>
        <div style={{display: 'flex', flexDirection: 'column', flexGrow: 2}}>
            <PluginStack
                showValidity={showValidity} noGrid
                schema={schema.get('items')} parentSchema={schema}
                storeKeys={storeKeys.push(index)} level={level + 1}
            />
        </div>

        {!readOnly && !notDeletable ? <IconButton
            onClick={() => {
                onChange(
                    storeKeys, ['value', 'internal'],
                    {
                        type: 'list-item-delete',
                        index: index,
                    },
                    schema.get('deleteOnEmpty') || required,
                    schema.get('type'),
                )
            }}
            size={btnSize}
            style={{margin: 'auto 6px', flexShrink: 0}}
        >
            <AccessTooltipIcon title={<Trans text={'labels.remove-entry'}/>}>
                <Remove fontSize={'inherit'}/>
            </AccessTooltipIcon>
        </IconButton> : null}
    </Grid>
}
SimpleListItem = memo(SimpleListItem)
export {SimpleListItem}

let SimpleListBase = ({
                          storeKeys, ownKey, schema, listSize, onChange,
                          showValidity, valid, errors, required, level,
                      }) => {
    const btnSize = schema.getIn(['view', 'btnSize']) || 'small';
    const notAddable = schema.get('notAddable')
    const notDeletable = schema.get('notDeletable')
    const readOnly = schema.get('readOnly')
    return <FormControl required={required} error={!valid && showValidity} component="fieldset" style={{width: '100%'}}>
        <Grid container spacing={2}>
            {!schema.getIn(['view', 'hideTitle']) ? <Grid item xs={12}>
                <FormLabel component="legend"><TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/></FormLabel>
            </Grid> : null}

            {Array.from(Array(listSize || 0)).map((itemVal, i) => <SimpleListItem
                key={i}
                index={i}
                showValidity={showValidity}
                schema={schema}
                storeKeys={storeKeys}
                btnSize={btnSize}
                level={level}
                notDeletable={notDeletable}
                readOnly={readOnly}
                required={required}
                onChange={onChange}
            />)}

            <Grid item xs={12}>
                {!readOnly && !notAddable ? <IconButton
                    onClick={() => {
                        onChange(
                            storeKeys, ['value', 'internal'],
                            {
                                type: 'list-item-add',
                                schema: schema,
                                required,
                            },
                        )
                    }}
                    size={btnSize}
                >
                    <AccessTooltipIcon title={<Trans text={'labels.add-entry'}/>}>
                        <Add fontSize={'inherit'}/>
                    </AccessTooltipIcon>
                </IconButton> : null}

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
SimpleListBase = memo(SimpleListBase)
const SimpleListWrapper = ({
                               value,
                               // eslint-disable-next-line no-unused-vars
                               internalValue,
                               ...props
                           }) => {
    return <SimpleListBase listSize={value?.size} {...props}/>
}
export const SimpleList = extractValue(SimpleListWrapper)
