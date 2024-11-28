/**
 * @jest-environment jsdom
 */
import { it, expect, describe } from '@jest/globals'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/jest-globals'
import { createOrderedMap } from '@ui-schema/system/createMap'
import { List } from 'immutable'
import { StringRendererCell } from './TextFieldCell.js'
import { MockSchemaMetaProvider } from '../../../tests/MockSchemaProvider.mock.js'

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
                />
            </MockSchemaMetaProvider>
        )
        expect(container.querySelector('.MuiTextField-root') !== null).toBeFalsy()
        expect(container.querySelector('.MuiInputLabel-root') !== null).toBeFalsy()
        expect(container.querySelector('.MuiInputBase-input') !== null).toBeTruthy()
        expect(container.querySelectorAll('.Mui-error').length > 0).toBeTruthy()
    })
})
