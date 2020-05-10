import React from "react";
import {
    FormControl, Grid, FormLabel, IconButton, Typography, Divider,
} from "@material-ui/core";
import {Add, Delete, KeyboardArrowUp, KeyboardArrowDown} from "@material-ui/icons";
import {NestedSchemaEditor, TransTitle, extractValue, memo, storeMoveItem, updateValue} from "@ui-schema/ui-schema";
import {ValidityHelperText} from "../../Component/LocaleHelperText";
import {List, Map} from 'immutable';
import {AccessTooltipIcon} from "../../Component/Tooltip";

const GenericList = extractValue(memo(({
                                           storeKeys, ownKey, schema, value, onChange,
                                           showValidity, valid, errors, required
                                       }) => {
    const btnSize = schema.getIn(['view', 'btnSize']) || 'small';

    return <FormControl required={required} error={!valid && showValidity} component="fieldset" style={{width: '100%'}}>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <FormLabel component="legend"><TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/></FormLabel>
            </Grid>

            {value ? value.map((val, i) =>
                <React.Fragment key={i}>
                    <Grid item xs={12} style={{display: 'flex'}}>
                        <Grid container spacing={2} wrap={'nowrap'}>
                            <Grid item style={{display: 'flex', flexDirection: 'column', flexShrink: 0}}>

                                {i > 0 ? <IconButton
                                    size={btnSize} style={{margin: '0 auto'}}
                                    onClick={storeMoveItem(onChange, storeKeys.push(i), -1)}>
                                    <AccessTooltipIcon title={`Move to ${(i + 1) - 1}. position`}>
                                        <KeyboardArrowUp fontSize={'inherit'}/>
                                    </AccessTooltipIcon>
                                </IconButton> : null}

                                <Typography
                                    component={'p'} variant={'caption'} align={'center'}
                                    aria-label={'Item Number'} style={{margin: '6px 0', minWidth: '2rem'}}>
                                    {i + 1}.
                                </Typography>

                                {i < value.size - 1 ? <IconButton
                                    size={btnSize} style={{margin: '0 auto'}}
                                    onClick={storeMoveItem(onChange, storeKeys.push(i), 1)}>
                                    <AccessTooltipIcon title={`Move to ${(i + 1) + 1}. position`}>
                                        <KeyboardArrowDown fontSize={'inherit'}/>
                                    </AccessTooltipIcon>
                                </IconButton> : null}

                            </Grid>

                            <Grid item style={{display: 'flex', flexDirection: 'column', flexGrow: 2}}>
                                {List.isList(schema.get('items')) ?
                                    /*
                                     * todo: tuple schemas do not support correct view/grid
                                     *   must it really be a nested schema for each entry
                                     */
                                    schema.get('items').map((item, j) => <NestedSchemaEditor
                                        key={j}
                                        showValidity={showValidity}
                                        storeKeys={storeKeys.push(i).push(j)}
                                        schema={item}
                                        noGrid
                                    />).valueSeq() :
                                    <NestedSchemaEditor
                                        showValidity={showValidity}
                                        storeKeys={storeKeys.push(i)}
                                        schema={schema.get('items')}
                                    />}
                            </Grid>

                            <Grid item style={{display: 'flex', flexShrink: 0}}>
                                <IconButton
                                    onClick={() => {
                                        onChange(updateValue(storeKeys, value.splice(i, 1)))
                                    }}
                                    size={btnSize}
                                    style={{margin: '0 0 auto 0'}}
                                >
                                    <AccessTooltipIcon title={'Delete Item'}>
                                        <Delete fontSize={'inherit'}/>
                                    </AccessTooltipIcon>
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Grid>
                    {i < value.size - 1 ? <Divider style={{width: '100%'}}/> : null}
                </React.Fragment>
            ).valueSeq() : null}

            <Grid item xs={12}>
                <IconButton
                    onClick={() => {
                        onChange(updateValue(storeKeys, value ?
                            value.push(List.isList(schema.get('items')) ? List([]) : Map({})) :
                            List([List.isList(schema.get('items')) ? List([]) : Map({end_checks: true})])))
                    }}
                    size={btnSize}
                >
                    <AccessTooltipIcon title={'New Item'}>
                        <Add fontSize={'inherit'}/>
                    </AccessTooltipIcon>
                </IconButton>

                <ValidityHelperText
                    /*
                     * only pass down errors which are not for a specific sub-schema
                     * todo: check if all needed are passed down
                     */
                    errors={errors.filter(err => List.isList(err) ? !err.getIn([1, 'arrayItems']) : true)}
                    showValidity={showValidity}
                    schema={schema}
                />
            </Grid>
        </Grid>
    </FormControl>
}));

export {GenericList,};
