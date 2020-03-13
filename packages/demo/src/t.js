import React from "react";
import AccountBox from "@material-ui/icons/AccountBox";
import {
    t, createMap,
    ERROR_CONST_MISMATCH, ERROR_DUPLICATE_ITEMS, ERROR_ENUM_MISMATCH,
    ERROR_MAX_LENGTH, ERROR_MIN_LENGTH, ERROR_MULTIPLE_OF, ERROR_NOT_FOUND_CONTAINS,
    ERROR_NOT_SET, ERROR_PATTERN, ERROR_WRONG_TYPE
} from "@ui-schema/ui-schema";

const icons = {
    'AccountBox': () => <AccountBox/>
};

const dicEN = createMap({
    error: {
        [ERROR_NOT_SET]: 'Please fill out this field',
        [ERROR_CONST_MISMATCH]: (context) => `Expected value is ${context.get('const')}`,
        [ERROR_ENUM_MISMATCH]: 'Please choose one valid entry',// todo: dyn value
        [ERROR_DUPLICATE_ITEMS]: 'Remove duplicate entries',// todo: dyn value
        [ERROR_NOT_FOUND_CONTAINS]: 'Select one of the needed options',// array: one item must be valid against a sub-schema
        [ERROR_MIN_LENGTH]: (context) => `Min. Length: ${typeof context.get('min') !== 'undefined' ? context.get('min') : typeof context.get('exclMin') !== 'undefined' ? context.get('exclMin') + 1 : '-'}`,
        [ERROR_MAX_LENGTH]: (context) => `Max. Length: ${typeof context.get('max') !== 'undefined' ? context.get('max') : typeof context.get('exclMin') !== 'undefined' ? context.get('exclMax') - 1 : '-'}`,
        [ERROR_MULTIPLE_OF]: (context) => `Must be multiple of ${context.get('multipleOf')}`,
        [ERROR_PATTERN]: 'Input is invalid',// todo: how should the pattern be made human understandable?
        [ERROR_WRONG_TYPE]: (context) => `Wrong type, expected ${context.get('type')} and got ${context.get('actual')}`,
    },
    widget: {
        stepper: {
            "step-1": {
                email: {title: "Email"},
                date: {title: "Date"},
            }
        }
    },
    icons,
});

const dicDE = createMap({
    error: {
        [ERROR_NOT_SET]: 'Bitte fülle dieses Feld aus',
        [ERROR_CONST_MISMATCH]: (context) => `Erwarteter Wert: ${context.get('const')}`,
        [ERROR_ENUM_MISMATCH]: 'Bitte wähle einen validen Eintrag',// todo: dyn value
        [ERROR_DUPLICATE_ITEMS]: 'Entferne Duplikate',// todo: dyn value
        [ERROR_NOT_FOUND_CONTAINS]: 'Wähle eine der notwendigen Optionen',// array: one item must be valid against a sub-schema
        [ERROR_MIN_LENGTH]: (context) => `Min. Länge: ${typeof context.get('min') !== 'undefined' ? context.get('min') : typeof context.get('exclMin') !== 'undefined' ? context.get('exclMin') + 1 : '-'}`,
        [ERROR_MAX_LENGTH]: (context) => `Max. Länge: ${typeof context.get('max') !== 'undefined' ? context.get('max') : typeof context.get('exclMin') !== 'undefined' ? context.get('exclMax') - 1 : '-'}`,
        [ERROR_MULTIPLE_OF]: (context) => `Erwartet ein vielfaches von ${context.get('multipleOf')}`,
        [ERROR_PATTERN]: 'Eingabe ist invalid',// todo: how should the pattern be made human understandable?
        [ERROR_WRONG_TYPE]: (context) => `Falscher typ, erwartet ${context.get('type')} aber ist ${context.get('actual')}`,
    },
    widget: {
        stepper: {
            "step-1": {
                email: {title: "E-Mail"},
                date: {title: "Datum"},
            }
        },
        layouts: {
            enum: {
                notice: "Notiz"
            },
        }
    },
    icons,
});

const tEN = t(dicEN, 'en');
const tDE = t(dicDE, 'de');

const browserT = (text, context, schema) => {
    const locale = window.localStorage.getItem('locale') || navigator.language;

    return locale === 'de' ? tDE(text, context, schema) : tEN(text, context, schema);
};

export {browserT}
