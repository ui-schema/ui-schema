import React from 'react'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import FormLabel from '@mui/material/FormLabel'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import Add from '@mui/icons-material/Add'
import Remove from '@mui/icons-material/Remove'
import { ValidityHelperText } from '@ui-schema/ds-material/Component/LocaleHelperText'
import { AccessTooltipIcon } from '@ui-schema/ds-material/Component/Tooltip'
import { ListButton, ListButtonOverwrites } from '@ui-schema/ds-material/Component/ListButton'
import { memo } from '@ui-schema/react/Utils/memo'
import { extractValue, WithOnChange, WithValue } from '@ui-schema/react/UIStore'
import { WidgetEngine } from '@ui-schema/react/WidgetEngine'
import { Translate } from '@ui-schema/react/Translate'
import { TranslateTitle } from '@ui-schema/react/TranslateTitle'
import { Map } from 'immutable'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { InfoRendererProps, MuiWidgetsBinding } from '@ui-schema/ds-material'
import { UISchemaMap } from '@ui-schema/system/Definitions'
import { UIStoreActionListItemDelete } from '@ui-schema/react/UIStoreActions'
import { ButtonProps } from '@mui/material/Button'

export type SimpleListItemProps = Pick<WidgetProps, 'schemaKeys' | 'showValidity' | 'schema' | 'storeKeys' | 'required'> & {
    notDeletable?: boolean
    readOnly?: boolean
    index: number
    btnSize?: IconButtonProps['size']
}

export const SimpleListItemBase: React.FC<SimpleListItemProps & Pick<WithValue, 'onChange'>> = (
    {
        showValidity, schema, schemaKeys, storeKeys, notDeletable,
        readOnly, required, onChange, index, btnSize,
    },
) => {
    return <Grid item xs={12} style={{display: 'flex'}}>
        <div style={{display: 'flex', flexDirection: 'column', flexGrow: 2}}>
            <WidgetEngine
                showValidity={showValidity} noGrid
                schema={schema.get('items') as UISchemaMap} parentSchema={schema}
                storeKeys={storeKeys.push(index)}
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
                    } as UIStoreActionListItemDelete)
                }}
                size={btnSize || 'small'}
                style={{margin: 'auto 6px', flexShrink: 0}}
            >
                <AccessTooltipIcon title={<Translate text={'labels.remove-entry'}/>}>
                    <Remove fontSize={'inherit'} style={{margin: 2}}/>
                </AccessTooltipIcon>
            </IconButton> : null}
    </Grid>
}
export const SimpleListItem = memo(SimpleListItemBase)

export const SimpleListInner: React.FC<WidgetProps<MuiWidgetsBinding & { InfoRenderer?: React.ComponentType<InfoRendererProps> }> & { listSize: number, btnAddShowLabel?: boolean, btnAddStyle?: React.CSSProperties } & ListButtonOverwrites & WithOnChange> = (
    {
        schemaKeys, storeKeys, schema, listSize, onChange,
        showValidity, valid, errors, required,
        widgets,
        btnAddShowLabel, btnAddStyle,
        btnSize: btnSizeProp,
        btnVariant: btnVariantProp,
        btnColor: btnColorProp,
    },
) => {
    const btnSize = (schema.getIn(['view', 'btnSize']) as IconButtonProps['size'] || btnSizeProp || 'small')
    const btnVariant = (schema.getIn(['view', 'btnVariant']) || btnVariantProp || undefined)
    const btnColor = (schema.getIn(['view', 'btnColor']) || btnColorProp || undefined)
    const notAddable = schema.get('notAddable')
    const notDeletable = schema.get('notDeletable')
    const readOnly = schema.get('readOnly')
    const InfoRenderer = widgets?.InfoRenderer
    return <FormControl required={required} error={!valid && showValidity} component="fieldset" style={{width: '100%'}}>
        <Grid container spacing={2}>
            {!schema.getIn(['view', 'hideTitle']) ? <Grid item xs={12}>
                <FormLabel component="legend"><TranslateTitle schema={schema} storeKeys={storeKeys}/></FormLabel>
            </Grid> : null}

            {InfoRenderer && schema?.get('info') ?
                <Grid item xs={12}>
                    <InfoRenderer
                        schema={schema} variant={'preview'} openAs={'embed'}
                        storeKeys={storeKeys} schemaKeys={schemaKeys} valid={valid} errors={errors}
                    />
                </Grid> :
                undefined}

            {Array.from(Array(listSize || 0)).map((_itemVal, i) =>
                <SimpleListItem
                    key={i}
                    index={i}
                    showValidity={showValidity}
                    schema={schema}
                    storeKeys={storeKeys}
                    schemaKeys={schemaKeys}
                    btnSize={btnSize}
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
                        btnVariant={btnVariant as ButtonProps['variant']}
                        btnColor={btnColor as ButtonProps['color']}
                        showLabel={btnAddShowLabel}
                        style={btnAddStyle}
                        Icon={Add}
                        title={
                            <Translate
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

export const SimpleListWrapper: React.FC<WidgetProps<MuiWidgetsBinding & { InfoRenderer?: React.ComponentType<InfoRendererProps> }> & { btnAddShowLabel?: boolean, btnAddStyle?: React.CSSProperties } & ListButtonOverwrites & WithValue> = (
    {
        value,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        internalValue,
        ...props
    },
) => {
    return <SimpleListBase listSize={value?.size} {...props}/>
}
export const SimpleList = extractValue(SimpleListWrapper)
