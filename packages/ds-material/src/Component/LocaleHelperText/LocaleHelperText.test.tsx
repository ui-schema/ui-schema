/**
 * @jest-environment jsdom
 */
import { it, expect, describe } from '@jest/globals'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/jest-globals'
import { createOrdered, createOrderedMap } from '@ui-schema/ui-schema/createMap'
import { ValidityHelperText } from './LocaleHelperText.js'
import { MockSchemaMetaProvider } from '../../../tests/MockSchemaProvider.mock'

describe('LocaleHelperText', () => {
    it('ValidityHelperText', () => {
        const {queryByText} = render(
            <MockSchemaMetaProvider>
                <ValidityHelperText
                    schema={createOrderedMap({type: 'string', widget: 'Text'})}
                    errors={createOrdered([{error: 'demo-err', context: {dummy: true}}])}
                    showValidity
                />
            </MockSchemaMetaProvider>,
        )
        expect(queryByText('error.demo-err') !== null).toBeTruthy()
    })
    it('ValidityHelperText no err', () => {
        const {queryByText} = render(
            <MockSchemaMetaProvider>
                <ValidityHelperText
                    schema={createOrderedMap({type: 'string', widget: 'Text'})}
                    errors={createOrdered([{error: 'demo-err', context: {dummy: true}}])}
                    showValidity={false}
                />
            </MockSchemaMetaProvider>,
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
            </MockSchemaMetaProvider>,
        )
        // expect(container.firstChild).toMatchSnapshot()
        expect(queryByText('browser-error') !== null).toBeTruthy()
    })
})
