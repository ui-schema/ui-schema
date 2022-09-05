/**
 * @jest-environment jsdom
 */
import React from 'react'
import { it, expect, describe } from '@jest/globals'
import { render } from '@testing-library/react'
// @ts-ignore
import { toBeInTheDocument, toHaveClass } from '@testing-library/jest-dom/matchers'
import { createOrderedMap } from '@ui-schema/system/createMap'
import { StringRenderer } from './TextField'
import { List } from 'immutable'
import { MockSchemaMetaProvider } from '../../../tests/MockSchemaProvider.mock'
import { createValidatorErrors } from '@ui-schema/system/ValidatorErrors'

expect.extend({toBeInTheDocument, toHaveClass})

describe('StringRenderer', () => {
    it('renders html', async () => {
        const {container} = render(
            <MockSchemaMetaProvider>
                {/* @ts-ignore */}
                <StringRenderer
                    schema={createOrderedMap({})}
                    storeKeys={List()}
                    valid={false}
                    showValidity={false}
                    errors={createValidatorErrors()}
                />
            </MockSchemaMetaProvider>
        )
        // expect(container.firstChild).toMatchSnapshot()
        expect(container.querySelector('.MuiTextField-root') !== null).toBeTruthy()
        expect(container.querySelector('.MuiInputLabel-root') !== null).toBeTruthy()
        expect(container.querySelector('.MuiInputBase-input') !== null).toBeTruthy()
        expect(container.querySelectorAll('.Mui-error').length).toBe(0)
    })

    it('renders html error', async () => {
        const {container} = render(
            <MockSchemaMetaProvider>
                {/* @ts-ignore */}
                <StringRenderer
                    schema={createOrderedMap({})}
                    storeKeys={List()}
                    valid={false}
                    showValidity
                    errors={createValidatorErrors()}
                />
            </MockSchemaMetaProvider>
        )
        expect(container.querySelector('.MuiTextField-root') !== null).toBeTruthy()
        expect(container.querySelector('.MuiInputLabel-root') !== null).toBeTruthy()
        expect(container.querySelector('.MuiInputBase-input') !== null).toBeTruthy()
        expect(container.querySelectorAll('.Mui-error').length > 0).toBeTruthy()
    })
})
