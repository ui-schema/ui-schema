import React from 'react';
import AccountBox from '@material-ui/icons/AccountBox';
import {makeTranslator, createMap} from '@ui-schema/ui-schema';
import * as en from '@ui-schema/dictionary/en'
import * as de from '@ui-schema/dictionary/de'

const icons = {
    'AccountBox': () => <AccountBox/>,
};

const dicEN = createMap({
    error: en.errors,
    labels: {...en.labels, ...en.richText, ...en.dnd},
    formats: {...en.formats},
    pagination: {...en.pagination},
    // for material-ui only icons which are set manually through schema are needed to add
    icons,
});

const dicDE = createMap({
    error: de.errors,
    labels: {...de.labels, ...de.richText, ...de.dnd},
    formats: {...de.formats},
    pagination: {...de.pagination},
    icons,
});

const tEN = makeTranslator(dicEN, 'en');
const tDE = makeTranslator(dicDE, 'de');

const browserT = (text, context, schema) => {
    const locale = window.localStorage.getItem('locale') || navigator.language;
    return locale === 'de' ? tDE(text, context, schema) : tEN(text, context, schema);
};

export {browserT}
