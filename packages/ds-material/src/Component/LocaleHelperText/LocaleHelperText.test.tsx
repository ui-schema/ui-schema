/**
 * @jest-environment jsdom
 */
import { it, expect, describe } from '@jest/globals'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/jest-globals'
import { createMap, createOrderedMap } from '@ui-schema/system/createMap'
import { ValidityHelperText } from './LocaleHelperText.js'
import { Map } from 'immutable'
import { MockSchemaMetaProvider } from '../../../tests/MockSchemaProvider.mock'
import { createValidatorErrors } from '@ui-schema/system/ValidatorErrors'

describe('LocaleHelperText', () => {
    it('ValidityHelperText', () => {
        const {queryByText} = render(
            <MockSchemaMetaProvider>
                <ValidityHelperText
                    schema={createOrderedMap({type: 'string', widget: 'Text'})}
                    errors={createValidatorErrors().addError('demo-err', Map({dummy: true}))}
                    showValidity
                />
            </MockSchemaMetaProvider>
        )
        expect(queryByText('error.demo-err') !== null).toBeTruthy()
    })
    it('ValidityHelperText no err', () => {
        const {queryByText} = render(
            <MockSchemaMetaProvider>
                <ValidityHelperText
                    schema={createOrderedMap({type: 'string', widget: 'Text'})}
                    errors={createValidatorErrors().addError('demo-err', createMap({dummy: true}))}
                    showValidity={false}
                />
            </MockSchemaMetaProvider>
        )
        expect(queryByText('browser-error') === null).toBeTruthy()
    })
    it('ValidityHelperText browser', () => {
        const {queryByText} = render(
            <MockSchemaMetaProvider>
                {/* @ts-ignore */}
                <ValidityHelperText
                    schema={createOrderedMap({tBy: 'browser'})}
                    browserError={<span>browser-error</span>}
                />
            </MockSchemaMetaProvider>
        )
        // expect(container.firstChild).toMatchSnapshot()
        expect(queryByText('browser-error') !== null).toBeTruthy()
    })
})
