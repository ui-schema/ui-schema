import React from 'react'
import { it, expect, describe } from '@jest/globals'
import { render } from '@testing-library/react'
// @ts-ignore
import { toBeInTheDocument, toHaveClass } from '@testing-library/jest-dom/matchers'
import { createMap, createOrderedMap } from '@ui-schema/ui-schema/Utils/createMap/createMap'
import { ValidityHelperText } from './LocaleHelperText'
import { createValidatorErrors } from '@ui-schema/ui-schema'
import { Map } from 'immutable'

expect.extend({toBeInTheDocument, toHaveClass})

describe('LocaleHelperText', () => {
    it('ValidityHelperText', async () => {
        const {queryByText} = render(
            <ValidityHelperText
                schema={createOrderedMap({type: 'string', widget: 'Text'})}
                errors={createValidatorErrors().addError('demo-err', Map({dummy: true}))}
                showValidity
            />
        )
        expect(queryByText('error.demo-err') !== null).toBeTruthy()
    })
    it('ValidityHelperText no err', async () => {
        const {queryByText} = render(
            <ValidityHelperText
                schema={createOrderedMap({type: 'string', widget: 'Text'})}
                errors={createValidatorErrors().addError('demo-err', createMap({dummy: true}))}
                showValidity={false}
            />
        )
        expect(queryByText('browser-error') === null).toBeTruthy()
    })
    it('ValidityHelperText browser', async () => {
        const {queryByText} = render(
            // @ts-ignore
            <ValidityHelperText
                schema={createOrderedMap({t: 'browser'})}
                browserError={<span>browser-error</span>}
            />
        )
        // expect(container.firstChild).toMatchSnapshot()
        expect(queryByText('browser-error') !== null).toBeTruthy()
    })
})
