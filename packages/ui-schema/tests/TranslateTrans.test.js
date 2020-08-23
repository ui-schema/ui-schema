import React from 'react';
import {it, expect, describe, test} from '@jest/globals';
import {render} from '@testing-library/react';
import {
    toBeInTheDocument,
    toHaveClass,
} from '@testing-library/jest-dom/matchers'
import {Trans} from '../src/Translate/Trans/Trans';
import {SchemaEditor} from "../src/SchemaEditor";
import {createEmptyStore} from "../src/EditorStore";
import {createMap, createOrderedMap} from "../src/Utils/createMap";
import {t} from "../src/Translate/t";
import {Map} from "immutable";
import {ERROR_MIN_LENGTH} from "@ui-schema/ui-schema/Validators";

expect.extend({toBeInTheDocument, toHaveClass})

const dicEN = createMap({
    titles: {
        'simple-number': 'Simple Number'
    },
    error: {
        [ERROR_MIN_LENGTH]: (context) => `Min. Length: ${typeof context.get('min') !== 'undefined' ? context.get('min') : '-'}`,
    },
});

const tEN = t(dicEN, 'en');

const widgets = {
    ErrorFallback: () => null,
    RootRenderer: () => null,
    GroupRenderer: () => null,
    pluginStack: [],
    validators: [],
    types: {},
    custom: {}
}

const schema = createOrderedMap({type: 'object'});

const SchemaMocker = ({children}) => {
    const [store, setStore] = React.useState(() => createEmptyStore(schema.get('type')));

    return <SchemaEditor
        schema={schema}
        store={store}
        onChange={setStore}
        widgets={widgets}
        t={tEN}
        children={children}
    />
};

describe('Translate\\Trans', () => {
    it('Text', async () => {
        const {findByText, queryByText} = render(
            <SchemaMocker>
                <Trans text={'titles.simple-number'}/>
            </SchemaMocker>
        );
        //expect(container.firstChild).toMatchSnapshot();
        const label = await findByText('Simple Number');
        expect(label).toBeInTheDocument();
        expect(queryByText('titles.simple-number')).toBeNull();
    });

    test('Function', async () => {
        const {findByText, queryByText} = render(
            <SchemaMocker>
                <Trans text={'error.' + ERROR_MIN_LENGTH} context={Map({min: 2})}/>
            </SchemaMocker>
        );
        //expect(container.firstChild).toMatchSnapshot();
        const label = await findByText('Min. Length: 2');
        expect(label).toBeInTheDocument();
        expect(queryByText('errors.' + ERROR_MIN_LENGTH)).toBeNull();
    });
});
