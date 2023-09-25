import React from 'react'
import AccountBox from '@mui/icons-material/AccountBox'
import { createMap } from '@ui-schema/system/createMap'
import { makeTranslator, translation, TranslatorDictionary } from '@ui-schema/system/Translator'
import * as en from '@ui-schema/dictionary/en'
import * as de from '@ui-schema/dictionary/de'

const BtsPlus = () => {
    return <svg className="bi bi-plus" width={20} height={20} viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M10 5.5a.5.5 0 01.5.5v4a.5.5 0 01-.5.5H6a.5.5 0 010-1h3.5V6a.5.5 0 01.5-.5z" clipRule="evenodd"/>
        <path fillRule="evenodd" d="M9.5 10a.5.5 0 01.5-.5h4a.5.5 0 010 1h-3.5V14a.5.5 0 01-1 0v-4z" clipRule="evenodd"/>
    </svg>
}
const BtsMinus = () => {
    return <svg className={['bi', 'bi-dash-circle', 'mx-3'].join(' ')} width={20} height={20} viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M8 15A7 7 0 108 1a7 7 0 000 14zm0 1A8 8 0 108 0a8 8 0 000 16z" clipRule="evenodd"/>
        <path fillRule="evenodd" d="M3.5 8a.5.5 0 01.5-.5h8a.5.5 0 010 1H4a.5.5 0 01-.5-.5z" clipRule="evenodd"/>
    </svg>
}

const icons = {
    'AccountBox': () => <AccountBox/>,
    'Plus': () => <BtsPlus/>,
    'Minus': () => <BtsMinus/>,
}

const dicEN = createMap({
    error: en.errors,
    labels: {...en.labels, ...en.richText, ...en.dnd},
    formats: {...en.formats},
    pagination: {...en.pagination},
    // for material-ui only icons which are set manually through schema are needed to add
    icons,
    widget: {
        stepper: {
            'step-1': {
                email: {title: 'Email'},
                date: {title: 'Date'},
            },
        },
    },
    titles: {
        'simple-number': 'Simple Number',
    },
    // todo: fix typings
}) as unknown as TranslatorDictionary

const dicDE = createMap({
    error: de.errors,
    labels: {...de.labels, ...de.richText, ...de.dnd},
    formats: {...de.formats},
    pagination: {...de.pagination},
    icons,
    widget: {
        stepper: {
            'step-1': {
                email: {title: 'E-Mail'},
                date: {title: 'Datum'},
            },
        },
        layouts: {
            enum: {
                notice: 'Notiz',
            },
        },
    },
    titles: {
        'simple-number': 'Einfache Nummer',
    },
    // todo: fix typings
}) as unknown as TranslatorDictionary

const tEN = makeTranslator<translation | React.ComponentType>(dicEN, 'en')
const tDE = makeTranslator<translation | React.ComponentType>(dicDE, 'de')

const browserT = (text, context, schema) => {
    const locale = window.localStorage.getItem('locale') || navigator.language
    return locale === 'de' ? tDE(text, context, schema) : tEN(text, context, schema)
    //return tEN(text, context, schema);
}

export { browserT }
