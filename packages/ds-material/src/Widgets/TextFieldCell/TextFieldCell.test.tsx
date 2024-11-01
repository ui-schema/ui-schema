/**
 * @jest-environment jsdom
 */
import React from 'react'
import { it, expect, describe } from '@jest/globals'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/jest-globals'
import { createOrderedMap } from '@ui-schema/ui-schema/Utils/createMap/createMap'
import { List } from 'immutable'
import { createValidatorErrors } from '@ui-schema/ui-schema'
import { StringRendererCell } from './TextFieldCell'
import { MockSchemaMetaProvider } from '../../../tests/MockSchemaProvider.mock'

describe('StringRenderer', () => {
    it('renders html', async () => {
        const {container} = render(
            <MockSchemaMetaProvider>
                {/* @ts-ignore */}
                <StringRendererCell
                    schema={createOrderedMap({})}
                    storeKeys={List()}
                    valid={false}
                    showValidity={false}
                    errors={createValidatorErrors()}
                />
            </MockSchemaMetaProvider>
        )
        // expect(container.firstChild).toMatchSnapshot()
        expect(container.querySelector('.MuiTextField-root') !== null).toBeFalsy()
        expect(container.querySelector('.MuiInputLabel-root') !== null).toBeFalsy()
        expect(container.querySelector('.MuiInputBase-input') !== null).toBeTruthy()
        expect(container.querySelectorAll('.Mui-error').length).toBe(0)
    })

    it('renders html error', async () => {
        const {container} = render(
            <MockSchemaMetaProvider>
                {/* @ts-ignore */}
                <StringRendererCell
                    schema={createOrderedMap({})}
                    storeKeys={List()}
                    valid={false}
                    showValidity
                    errors={createValidatorErrors()}
                />
            </MockSchemaMetaProvider>
        )
        expect(container.querySelector('.MuiTextField-root') !== null).toBeFalsy()
        expect(container.querySelector('.MuiInputLabel-root') !== null).toBeFalsy()
        expect(container.querySelector('.MuiInputBase-input') !== null).toBeTruthy()
        expect(container.querySelectorAll('.Mui-error').length > 0).toBeTruthy()
    })
})
