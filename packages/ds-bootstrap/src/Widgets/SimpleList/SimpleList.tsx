import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { WidgetProps } from '@ui-schema/react/Widget'
import React from 'react'
import { TranslateTitle } from '@ui-schema/react/TranslateTitle'
import { memo } from '@ui-schema/react/Utils/memo'
import { extractValue } from '@ui-schema/react/UIStore'
import { WidgetEngine } from '@ui-schema/react/WidgetEngine'
import { List } from 'immutable'
import { ValidityHelperText } from '@ui-schema/ds-bootstrap/Component/LocaleHelperText'
import { IconPlus, IconMinus } from '@ui-schema/ds-bootstrap/Component/Icons'

const SimpleList = extractValue(memo((
    {
        storeKeys, schema, value, onChange,
        showValidity, errors, required,
    }: WidgetProps,
) => {
    const btnSize = schema.getIn(['view', 'btnSize']) as string || 'small'

    const classFormGroup = ['form-group', 'd-flex', 'align-items-center']
    const classFormControl = ['form-control']
    if (showValidity && errors?.size) {
        classFormControl.push('is-invalid')
    }
    if (showValidity && !errors?.size) {
        classFormGroup.push('was-validated')
    }

    return <React.Fragment>
        <TranslateTitle schema={schema} storeKeys={storeKeys}/>
        <div>
            {List.isList(value) ? value.map((_val, i) =>
                <div
                    key={i}
                    className={classFormGroup.join(' ')}
                >
                    <WidgetEngine<{ className?: string }>
                        className={classFormControl.join(' ')}
                        showValidity={showValidity}
                        storeKeys={storeKeys.push(i)}
                        parentSchema={schema}
                        schema={schema.get('items') as UISchemaMap}
                        noGrid
                    />
                    <div>
                        <IconMinus
                            btnSize={btnSize}
                            onClick={() => {
                                onChange({
                                    storeKeys,
                                    scopes: ['value'],
                                    type: 'update',
                                    updater: ({value: storeValue}) => ({value: storeValue.splice(i, 1)}),
                                    schema,
                                    required,
                                })
                            }}/>
                    </div>
                </div>,
            ).valueSeq() : null}
            <div>
                <IconPlus
                    btnSize={btnSize}
                    onClick={() => {
                        onChange({
                            storeKeys,
                            scopes: ['value'],
                            type: 'update',
                            updater: ({value: storeValue = List()}) => ({value: storeValue.push('')}),
                            schema,
                            required,
                        })
                    }}/>
            </div>
        </div>
        <ValidityHelperText
            /* only pass down errors which are not for a specific sub-schema */
            errors={errors}
            showValidity={showValidity}
            schema={schema}
        />
    </React.Fragment>
}))

export { SimpleList }
