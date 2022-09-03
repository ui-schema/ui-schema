/**
 * @jest-environment jsdom
 */
import React from 'react'
import { it, expect, describe } from '@jest/globals'
import { render } from '@testing-library/react'
// @ts-ignore
import { toBeInTheDocument, toHaveClass } from '@testing-library/jest-dom/matchers'
import { createOrderedMap } from '@ui-schema/system/Utils/createMap'
import { StringRendererDebounced } from './TextFieldDebounced'
import { List } from 'immutable'
import { createValidatorErrors } from '@ui-schema/ui-schema'
import { MockSchemaMetaProvider } from '../../../tests/MockSchemaProvider.mock'

expect.extend({toBeInTheDocument, toHaveClass})

describe('StringRendererDebounced', () => {
    it('renders html', async () => {
        const {container} = render(
            <MockSchemaMetaProvider>
                {/* @ts-ignore */}
                <StringRendererDebounced
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
                <StringRendererDebounced
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
