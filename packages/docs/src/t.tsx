import AccountBox from '@mui/icons-material/AccountBox'
import { makeTranslator, TranslatorDictionary, Translator } from '@ui-schema/ui-schema/Translator'
import { createMap } from '@ui-schema/ui-schema/createMap'
import * as en from '@ui-schema/dictionary/en'
import * as de from '@ui-schema/dictionary/de'

const icons = {
    'AccountBox': () => <AccountBox/>,
}

const dicEN = createMap({
    error: en.errors,
    labels: {...en.labels, ...en.richText, ...en.dnd},
    formats: {...en.formats},
    pagination: {...en.pagination},
    // for material-ui only icons which are set manually through schema are needed to add
    icons,
}) as TranslatorDictionary

const dicDE = createMap({
    error: de.errors,
    labels: {...de.labels, ...de.richText, ...de.dnd},
    formats: {...de.formats},
    pagination: {...de.pagination},
    icons,
}) as TranslatorDictionary

const tEN = makeTranslator(dicEN, 'en')
const tDE = makeTranslator(dicDE, 'de')

const browserT: Translator = (text, context, schema) => {
    const locale = window.localStorage.getItem('locale') || navigator.language
    return locale === 'de' ? tDE(text, context, schema) : tEN(text, context, schema)
}

export { browserT }
