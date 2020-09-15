import React from 'react'
import { it, expect, describe } from '@jest/globals'
import { render } from '@testing-library/react'
// @ts-ignore
import { toBeInTheDocument, toHaveClass } from '@testing-library/jest-dom/matchers'
import { ValidatorStack } from './ValidatorStack'
import { createOrderedMap } from '@ui-schema/ui-schema/Utils/createMap/createMap'
import { handleValidatorStack } from './ValidatorStack'

expect.extend({toBeInTheDocument, toHaveClass})

describe('ValidatorStack', () => {
    it('ValidatorStack', async () => {
        const {queryByText} = render(
            // ts-@ignore
            <ValidatorStack
                // ts-@ignore
                handled
                // ts-@ignore
                widgets={{
                    types: {
                        string: ({valid, handled}: { valid?: boolean, handled?: boolean }) =>
                            valid === true && handled === true ? 'is-valid' : 'is-invalid',
                    },
                    validators: [{validate: () => ({valid: true})}],
                    pluginStack: [],
                }}
                schema={createOrderedMap({type: 'string'})}
            />
        )
        expect(queryByText('is-valid') !== null).toBeTruthy()
    })
})

describe('handleValidatorStack', () => {
    test.each([
        [{
            widgets: {
                validators: [{
                    validate: (): { valid: boolean } => ({valid: true}),
                }],
            },
        }, 'valid', true],
        [{
            widgets: {
                validators: [{
                    should: (): boolean => false,
                    validate: (): { valid: boolean } => ({valid: true}),
                }],
            },
        }, 'valid', undefined],
        [{
            widgets: {
                validators: [{
                    should: (): boolean => true,
                }],
            },
        }, 'valid', undefined],
        [{
            widgets: {},
        }, 'valid', undefined],
        [{}, 'valid', undefined],
        [{
            widgets: {
                validators: [{
                    should: () => true,
                    validate: (): { valid: boolean } => ({valid: true}),
                }],
            },
        }, 'valid', true],
        [{
            widgets: {
                validators: [{
                    should: (): boolean => false,
                    validate: (): { valid: boolean } => ({valid: true}),
                    noValidate: (): { valid: number } => ({valid: 100}),
                }],
            },
        }, 'valid', 100],
    ])(
        'handleValidatorStack(%j): %j, %j',
        (props, keyA: string, expectA: any) => {
            // @ts-ignore
            const newProps = handleValidatorStack(props)
            // @ts-ignore
            expect(newProps[keyA]).toBe(expectA)
            // @ts-ignore
            // expect(newProps[keyB]).toBe(expectB)
        }
    )
})
