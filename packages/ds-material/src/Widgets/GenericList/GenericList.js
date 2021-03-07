import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Add from '@material-ui/icons/Add';
import Delete from '@material-ui/icons/Delete';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import {TransTitle, extractValue, memo, PluginStack, Trans} from '@ui-schema/ui-schema';
import {ValidityHelperText} from '../../Component/LocaleHelperText/LocaleHelperText';
import {List, Map} from 'immutable';
import {AccessTooltipIcon} from '../../Component/Tooltip/Tooltip';
import {moveItem} from '@ui-schema/ui-schema/Utils/moveItem/moveItem';

let GenericListItem = ({index, listSize, schema, deleteOnEmpty, showValidity, onChange, storeKeys, level, btnSize}) => {
    const ownKeys = storeKeys.push(index)
    const itemsSchema = schema.get('items')
    const readOnly = schema.get('readOnly')
    return <React.Fragment>
        <Grid item xs={12} style={{display: 'flex'}}>
            <Grid container spacing={2} wrap={'nowrap'}>
                <Grid item style={{display: 'flex', flexDirection: 'column', flexShrink: 0}}>

                    {!readOnly && index > 0 ? <IconButton
                        size={btnSize} style={{margin: '0 auto'}}
                        onClick={() =>
                            onChange(
                                storeKeys, ['value', 'internal'],
                                ({value, internal}) => ({
                                    value: moveItem(value, index, index - 1),
                                    internal: moveItem(internal, index, index - 1),
                                    // todo: also moveItem in `valid`? that should be handled automatically atm. and is not needed !i think!
                                }),
                                deleteOnEmpty,
                                'array',
                            )
                        }
                    >
                        <AccessTooltipIcon title={<Trans text={'labels.move-to-position'} context={Map({nextIndex: index + 1 - 1})}/>}>
                            <KeyboardArrowUp fontSize={'inherit'}/>
                        </AccessTooltipIcon>
                    </IconButton> : null}

                    <Typography
                        component={'p'} variant={'caption'} align={'center'}
                        style={{margin: '6px 0', minWidth: '2rem'}}
                    >
                        {index + 1}.
                        <Typography component={'span'} variant={'srOnly'}>
                            <Trans text={'labels.entry'}/>
                        </Typography>
                    </Typography>

                    {!readOnly && index < listSize - 1 ? <IconButton
                        size={btnSize} style={{margin: '0 auto'}}
                        onClick={() =>
                            onChange(
                                storeKeys, ['value', 'internal'], ({value, internal}) => ({
                                    value: moveItem(value, index, index + 1),
                                    internal: moveItem(internal, index, index + 1),
                                }),
                                deleteOnEmpty,
                                'array',
                            )
                        }
                    >
                        <AccessTooltipIcon title={<Trans text={'labels.move-to-position'} context={Map({nextIndex: index + 1 + 1})}/>}>
                            <KeyboardArrowDown fontSize={'inherit'}/>
                        </AccessTooltipIcon>
                    </IconButton> : null}

                </Grid>

                {List.isList(itemsSchema) ?
                    <Grid item style={{display: 'flex', flexDirection: 'column', flexGrow: 2}}>
                        <Grid container spacing={2}>
                            {itemsSchema.map((item, j) => <PluginStack
                                key={j}
                                showValidity={showValidity}
                                storeKeys={ownKeys.push(j)}
                                schema={item}
                                parentSchema={schema}
                                level={level + 1}
                            />).valueSeq()}
                        </Grid>
                    </Grid> :
                    <PluginStack
                        showValidity={showValidity}
                        schema={itemsSchema} parentSchema={schema}
                        storeKeys={ownKeys} level={level + 1}
                    />}

                {!readOnly ? <Grid item style={{display: 'flex', flexShrink: 0}}>
                    <IconButton
                        onClick={() =>
                            onChange(
                                storeKeys, ['value', 'internal'],
                                ({value, internal}) => ({
                                    value: value.splice(index, 1),
                                    internal: internal.splice(index, 1),
                                }),
                                deleteOnEmpty,
                                'array',
                            )
                        }
                        size={btnSize}
                        style={{margin: '0 0 auto 0'}}
                    >
                        <AccessTooltipIcon title={<Trans text={'labels.remove-item'}/>}>
                            <Delete fontSize={'inherit'}/>
                        </AccessTooltipIcon>
                    </IconButton>
                </Grid> : null}
            </Grid>
        </Grid>
        {index < listSize - 1 ? <Divider style={{width: '100%'}}/> : null}
    </React.Fragment>
}
GenericListItem = memo(GenericListItem)

const GenericList = extractValue(memo(({
                                           storeKeys, ownKey, schema, value: list, onChange,
                                           showValidity, valid, errors, required, level,
                                       }) => {
    const btnSize = schema.getIn(['view', 'btnSize']) || 'small';

    return <FormControl required={required} error={!valid && showValidity} component="fieldset" style={{width: '100%'}}>
        <Grid container spacing={2}>
            {!schema.getIn(['view', 'hideTitle']) ? <Grid item xs={12}>
                <FormLabel component="legend"><TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/></FormLabel>
            </Grid> : null}

            {list ? list.map((val, i) =>
                <GenericListItem
                    key={i} index={i} listSize={list.size}
                    btnSize={btnSize} storeKeys={storeKeys}
                    deleteOnEmpty={schema.get('deleteOnEmpty') || required}
                    schema={schema} onChange={onChange}
                    level={level}
                />,
            ).valueSeq() : null}

            <Grid item xs={12}>
                {!schema.get('readOnly') ?
                    <IconButton
                        onClick={() => {
                            onChange(
                                storeKeys, ['value', 'internal'],
                                ({value = List(), internal = List()}) => ({
                                    value: value.push(List.isList(schema.get('items')) ? List() : Map()),
                                    internal: internal.push(List.isList(schema.get('items')) ? List() : Map()),
                                }),
                                schema.get('deleteOnEmpty') || required,
                                schema.get('type'),
                            )
                        }}
                        size={btnSize}
                    >
                        <AccessTooltipIcon title={<Trans text={'labels.add-item'}/>}>
                            <Add fontSize={'inherit'}/>
                        </AccessTooltipIcon>
                    </IconButton> : null}

                <ValidityHelperText
                    /*
                     * only pass down errors which are not for a specific sub-schema
                     * todo: check if all needed are passed down
                     */
                    errors={errors}
                    showValidity={showValidity}
                    schema={schema}
                />
            </Grid>
        </Grid>
    </FormControl>
}));

export {GenericList};
