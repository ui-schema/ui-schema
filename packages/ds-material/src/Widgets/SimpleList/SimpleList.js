import React from "react";
import {
    FormControl, Grid, FormLabel, IconButton
} from "@material-ui/core";
import {Add, Remove} from "@material-ui/icons";
import {NestedSchemaEditor, TransTitle, extractValue, memo, updateValue} from "@ui-schema/ui-schema";
import {ValidityHelperText} from "../../Component/LocaleHelperText";
import {List} from 'immutable';
import {AccessTooltipIcon} from "../../Component/Tooltip";

const SimpleList = extractValue(memo(({
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
                <Grid key={i} item xs={12} style={{display: 'flex'}}>
                    <div style={{display: 'flex', flexDirection: 'column', flexGrow: 2}}>
                        <NestedSchemaEditor
                            showValidity={showValidity}
                            storeKeys={storeKeys.push(i)}
                            schema={schema.get('items')}
                            noGrid
                        />
                    </div>

                    <IconButton
                        onClick={() => {
                            onChange(updateValue(storeKeys, value.splice(i, 1)))
                        }}
                        size={btnSize}
                        style={{margin: 'auto 6px', flexShrink: 0}}
                    >
                        <AccessTooltipIcon title={'Remove Entry'}>
                            <Remove fontSize={'inherit'}/>
                        </AccessTooltipIcon>
                    </IconButton>
                </Grid>
            ).valueSeq() : null}

            <Grid item xs={12}>
                <IconButton
                    onClick={() => {
                        onChange(updateValue(storeKeys, value ? value.push('') : List([''])))
                    }}
                    size={btnSize}
                >
                    <AccessTooltipIcon title={'Add Entry'}>
                        <Add fontSize={'inherit'}/>
                    </AccessTooltipIcon>
                </IconButton>

                <ValidityHelperText
                    /* only pass down errors which are not for a specific sub-schema */
                    errors={errors.filter(err => List.isList(err) ? !err.getIn([1, 'arrayItems']) : true)}
                    showValidity={showValidity}
                    schema={schema}
                />
            </Grid>
        </Grid>
    </FormControl>
}));

export {SimpleList,};
