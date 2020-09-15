import React from 'react';
import {it, expect, describe, test} from '@jest/globals';
import {render} from '@testing-library/react';
import {
    toBeInTheDocument,
    toHaveClass,
} from '@testing-library/jest-dom/matchers'
import {Trans} from '../src/Translate/Trans/Trans';
import {createMap} from '../src/Utils/createMap';
import {t} from '../src/Translate/t';
import {Map} from 'immutable';
import {ERROR_MIN_LENGTH} from '@ui-schema/ui-schema/Validators';
import {MockSchema, MockSchemaProvider, MockWidgets} from './MockSchemaProvider.mock';

expect.extend({toBeInTheDocument, toHaveClass})

const dicEN = createMap({
    titles: {
        'simple-number': 'Simple Number',
    },
    error: {
        [ERROR_MIN_LENGTH]: (context) => `Min. Length: ${typeof context.get('min') !== 'undefined' ? context.get('min') : '-'}`,
    },
});

const tEN = t(dicEN, 'en');

describe('Translate\\Trans', () => {
    it('Text', async () => {
        const {findByText, queryByText} = render(
            <MockSchemaProvider t={tEN} schema={MockSchema} widgets={MockWidgets}>
                <Trans text={'titles.simple-number'}/>
            </MockSchemaProvider>,
        );
        //expect(container.firstChild).toMatchSnapshot();
        const label = await findByText('Simple Number');
        expect(label).toBeInTheDocument();
        expect(queryByText('titles.simple-number')).toBeNull();
    });

    test('Function', async () => {
        const {findByText, queryByText} = render(
            <MockSchemaProvider t={tEN} schema={MockSchema} widgets={MockWidgets}>
                <Trans text={'error.' + ERROR_MIN_LENGTH} context={Map({min: 2})}/>
            </MockSchemaProvider>,
        );
        //expect(container.firstChild).toMatchSnapshot();
        const label = await findByText('Min. Length: 2');
        expect(label).toBeInTheDocument();
        expect(queryByText('errors.' + ERROR_MIN_LENGTH)).toBeNull();
    });
});
