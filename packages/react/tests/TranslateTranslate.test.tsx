/**
 * @jest-environment jsdom
 */
import { it, expect, describe, test } from '@jest/globals'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/jest-globals'
import { Translate } from '@ui-schema/react/Translate'
import { makeTranslator } from '@ui-schema/ui-schema/Translator'
import { createMap } from '@ui-schema/ui-schema/createMap'
import { Map } from 'immutable'
import { ERROR_MIN_LENGTH } from '@ui-schema/json-schema/Validators'

const dicEN = createMap({
    titles: {
        'simple-number': 'Simple Number',
    },
    error: {
        [ERROR_MIN_LENGTH]: (context) => `Min. Length: ${typeof context.get('min') !== 'undefined' ? context.get('min') : '-'}`,
    },
})

const tEN = makeTranslator(dicEN, 'en')

describe('Translate\\Translate', () => {
    it('Text', async () => {
        const {findByText, queryByText} = render(
            <Translate text={'titles.simple-number'} t={tEN}/>,
        )
        //expect(container.firstChild).toMatchSnapshot();
        const label = await findByText('Simple Number')
        expect(label).toBeInTheDocument()
        expect(queryByText('titles.simple-number')).toBeNull()
    })

    test('Function', async () => {
        const {findByText, queryByText} = render(
            <Translate text={'error.' + ERROR_MIN_LENGTH} context={Map({min: 2})} t={tEN}/>,
        )
        //expect(container.firstChild).toMatchSnapshot();
        const label = await findByText('Min. Length: 2')
        expect(label).toBeInTheDocument()
        expect(queryByText('error.' + ERROR_MIN_LENGTH)).toBeNull()
    })
})
