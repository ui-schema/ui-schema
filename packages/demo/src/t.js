import {
    t, createMap, ERROR_CONST_MISMATCH, ERROR_DUPLICATE_ITEMS, ERROR_ENUM_MISMATCH, ERROR_MAX_LENGTH, ERROR_MIN_LENGTH, ERROR_MULTIPLE_OF, ERROR_NOT_FOUND_CONTAINS,
    ERROR_NOT_SET, ERROR_PATTERN, ERROR_WRONG_TYPE
} from "@ui-schema/ui-schema";

const dicEN = createMap({
    error: {
        [ERROR_NOT_SET]: 'Please fill out this field',
        [ERROR_CONST_MISMATCH]: (context) => `Expected value is ${context.get('const')}`,
        [ERROR_ENUM_MISMATCH]: 'Please choose one valid entry',// todo: dyn value
        [ERROR_DUPLICATE_ITEMS]: 'Remove duplicate entries',// todo: dyn value
        [ERROR_NOT_FOUND_CONTAINS]: 'Select one of the needed options',// array: one item must be valid against a sub-schema
        [ERROR_MIN_LENGTH]: (context) => `Min. Length: ${context.get('min') || context.get('exclMin') + 1}`,
        [ERROR_MAX_LENGTH]: (context) => `Max. Length: ${context.get('max') || context.get('exclMax') - 1}`,
        [ERROR_MULTIPLE_OF]: (context) => `Must be multiple of ${context.get('multipleOf')}`,
        [ERROR_PATTERN]: 'Input is invalid',// todo: how should the pattern be made human understandable?
        [ERROR_WRONG_TYPE]: (context) => `Wrong type, expected ${context.get('type')} and got ${context.get('actual')}`,
    }
});

const dicDE = createMap({
    error: {
        [ERROR_NOT_SET]: 'Bitte fülle dieses Feld aus',
        [ERROR_CONST_MISMATCH]: (context) => `Erwarteter Wert: ${context.get('const')}`,
        [ERROR_ENUM_MISMATCH]: 'Bitte wähle einen validen Eintrag',// todo: dyn value
        [ERROR_DUPLICATE_ITEMS]: 'Entferne Duplikate',// todo: dyn value
        [ERROR_NOT_FOUND_CONTAINS]: 'Wähle eine der notwendigen Optionen',// array: one item must be valid against a sub-schema
        [ERROR_MIN_LENGTH]: (context) => `Min. Länge: ${context.get('min') || context.get('exclMin') + 1}`,
        [ERROR_MAX_LENGTH]: (context) => `Max. Länge: ${context.get('max') || context.get('exclMax') - 1}`,
        [ERROR_MULTIPLE_OF]: (context) => `Erwartet ein vielfaches von ${context.get('multipleOf')}`,
        [ERROR_PATTERN]: 'Eingabe ist invalid',// todo: how should the pattern be made human understandable?
        [ERROR_WRONG_TYPE]: (context) => `Falscher typ, erwartet ${context.get('type')} aber ist ${context.get('actual')}`,
    }
});

const tEN = t(dicEN);
const tDE = t(dicDE);

const browserT = (text, context) => {
    const locale = window.localStorage.getItem('locale') || (navigator.language || navigator.userLanguag);
    return locale === 'de' ? tDE(text, context) : tEN(text, context);
};

export {browserT}
