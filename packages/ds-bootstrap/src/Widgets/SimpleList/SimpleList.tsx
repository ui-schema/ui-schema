import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { WidgetProps } from '@ui-schema/react/Widget'
import * as React from 'react'
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

    return <React.Fragment>
        <p className={'form-label'}><TranslateTitle schema={schema} storeKeys={storeKeys}/></p>
        <div className={'d-flex flex-column row-gap-3'}>
            {List.isList(value) ? value.map((_val, i) =>
                <div
                    key={i}
                    className={'d-flex align-items-center'}
                >
                    <div
                        className={'flex-grow-1'}
                    >
                        <WidgetEngine
                            showValidity={showValidity}
                            storeKeys={storeKeys.push(i)}
                            parentSchema={schema}
                            schema={schema.get('items') as UISchemaMap}
                            noGrid
                        />
                    </div>
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
