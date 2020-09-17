import React from 'react'
import { it, expect, describe } from '@jest/globals'
import { render } from '@testing-library/react'
// @ts-ignore
import { toBeInTheDocument, toHaveClass } from '@testing-library/jest-dom/matchers'
import { createOrderedMap } from '@ui-schema/ui-schema/Utils/createMap/createMap'
import { StringRenderer } from './TextField'
import { List } from 'immutable'
import { createValidatorErrors } from '@ui-schema/ui-schema'
import { convertStringToNumber } from './TextField'

expect.extend({toBeInTheDocument, toHaveClass})

describe('StringRenderer', () => {
    it('convertStringToNumber', async () => {
        console.error = jest.fn()
        expect(convertStringToNumber('10', 'number')).toBe(10)
        expect(convertStringToNumber('010', 'number')).toBe(10)
        expect(convertStringToNumber('0', 'number')).toBe(0)
        expect(convertStringToNumber(0, 'number')).toBe(0)
        expect(convertStringToNumber('', 'number')).toBe('')
        expect(convertStringToNumber('010', 'string')).toBe('010')
        expect(convertStringToNumber('a010', 'number')).toBe(undefined)
    })
    it('renders html', async () => {
        const {container} = render(
            // @ts-ignore
            <StringRenderer
                schema={createOrderedMap({})}
                storeKeys={List()}
                valid={false}
                showValidity={false}
                errors={createValidatorErrors()}
            />
        )
        // expect(container.firstChild).toMatchSnapshot()
        expect(container.querySelector('.MuiTextField-root') !== null).toBeTruthy()
        expect(container.querySelector('.MuiInputLabel-root') !== null).toBeTruthy()
        expect(container.querySelector('.MuiInputBase-input') !== null).toBeTruthy()
        expect(container.querySelectorAll('.Mui-error').length).toBe(0)
    })

    it('renders html error', async () => {
        const {container} = render(
            // @ts-ignore
            <StringRenderer
                schema={createOrderedMap({})}
                storeKeys={List()}
                valid={false}
                showValidity
                errors={createValidatorErrors()}
            />
        )
        expect(container.querySelector('.MuiTextField-root') !== null).toBeTruthy()
        expect(container.querySelector('.MuiInputLabel-root') !== null).toBeTruthy()
        expect(container.querySelector('.MuiInputBase-input') !== null).toBeTruthy()
        expect(container.querySelectorAll('.Mui-error').length > 0).toBeTruthy()
    })
})
