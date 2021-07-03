import {
    ERROR_CONST_MISMATCH,
    ERROR_DUPLICATE_ITEMS,
    ERROR_ENUM_MISMATCH,
    ERROR_MAX_LENGTH,
    ERROR_MIN_LENGTH,
    ERROR_MULTIPLE_OF,
    ERROR_NOT_FOUND_CONTAINS,
    ERROR_NOT_SET,
    ERROR_PATTERN,
    ERROR_WRONG_TYPE,
    ERROR_ADDITIONAL_ITEMS,
    ERROR_MIN_CONTAINS,
    ERROR_MAX_CONTAINS,
    ERROR_ADDITIONAL_PROPERTIES,
} from '@ui-schema/ui-schema/Validators';
import {typeToString} from '@ui-schema/dictionary/Utils/typeToString';

export const errors = {
    [ERROR_NOT_SET]: 'Bitte fülle das Feld aus',
    [ERROR_CONST_MISMATCH]: (context) => `Erwartet wird der Wert: ${context.get('const')}`,
    [ERROR_ENUM_MISMATCH]: (context) => `Bitte wähle einen validen eintrag, z.B.: ${context.get('enum')}`,
    [ERROR_DUPLICATE_ITEMS]: 'Entferne Duplikate aus der Liste',
    [ERROR_NOT_FOUND_CONTAINS]: 'Minimum ein Eintrag muss wie spezifiert existieren',
    [ERROR_MIN_LENGTH]: (context) => `Min. Länge: ${typeof context.get('min') !== 'undefined' ? context.get('min') : typeof context.get('exclMin') !== 'undefined' ? context.get('exclMin') + 1 : '-'}`,
    [ERROR_MAX_LENGTH]: (context) => `Max. Länge: ${
        typeof context.get('max') !== 'undefined' ? context.get('max') :
            typeof context.get('exclMin') !== 'undefined' ? context.get('exclMin') - 1 :
                typeof context.get('exclMax') !== 'undefined' ? context.get('exclMax') - 1 : '-'
    }`,
    [ERROR_MULTIPLE_OF]: (context) => `Erwartet ein mehrfaches von ${context.get('multipleOf')}`,
    [ERROR_PATTERN]: (context) => `Eingabe nicht korrekt, benötigt ${context.getIn(['patternError', 'de']) || ('match ' + context.get('pattern'))}`,
    [ERROR_WRONG_TYPE]: (context) => `Falscher Typ, erwartet ${typeToString(context.get('type'))} aber ist ${context.get('actual')}`,
    [ERROR_ADDITIONAL_ITEMS]: 'Darf nur spezifizierte Elemente enthalten, entferne die weiteren.',
    [ERROR_ADDITIONAL_PROPERTIES]: 'Darf nur spezifizierte Eigenschaften enthalten, entferne die weiteren.',
    [ERROR_MIN_CONTAINS]: (context) => `Muss min. ${context.get('minContains')} mal das spezifizierte Element enthalten`,
    [ERROR_MAX_CONTAINS]: (context) => `Darf max. ${context.get('maxContains')} mal das spezifizierte Element enthalten`,
}
