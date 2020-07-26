import React from 'react';
import {it, expect} from '@jest/globals';
import {fireEvent, render} from '@testing-library/react';
import {
    toBeInTheDocument,
    toHaveClass,
} from '@testing-library/jest-dom/matchers'
import {Trans} from '../src/Translate/Trans/Trans';
import {SchemaEditor} from "../src/SchemaEditor";
import {createEmptyStore} from "../src/EditorStore";
import {createMap, createOrderedMap} from "../src/Utils/createMap";
import {t} from "../src/Translate/t";

expect.extend({toBeInTheDocument, toHaveClass})

const dicEN = createMap({
    titles: {
        'simple-number': 'Simple Number'
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

it('Translate\\Trans', async () => {
    const {findByText, container, queryByText} = render(
        <SchemaMocker>
            <Trans text={'titles.simple-number'}/>
        </SchemaMocker>
    );
    //expect(container.firstChild).toMatchSnapshot();
    const label = await findByText('Simple Number');
    expect(label).toBeInTheDocument();
    expect(queryByText('titles.simple-number')).toBeNull();
});
