import {
    ERROR_CONST_MISMATCH,
    ERROR_DUPLICATE_ITEMS,
    ERROR_ENUM_MISMATCH,
    ERROR_MAX_LENGTH,
    ERROR_MIN_LENGTH,
    ERROR_MULTIPLE_OF,
    ERROR_NOT_FOUND_CONTAINS,
    ERROR_NOT_SET,
    ERROR_ONE_OF_INVALID,
    ERROR_PATTERN,
    ERROR_WRONG_TYPE,
    ERROR_ADDITIONAL_ITEMS,
    ERROR_MIN_CONTAINS,
    ERROR_MAX_CONTAINS,
    ERROR_ADDITIONAL_PROPERTIES,
} from '@ui-schema/system/Validators';
import {typeToString} from '@ui-schema/dictionary/typeToString';

export const errors = {
    [ERROR_NOT_SET]: 'Please fill out this field',
    [ERROR_CONST_MISMATCH]: (context) => `Expected value is: ${context.get('const')}`,
    [ERROR_ENUM_MISMATCH]: (context) => `Please choose a valid entry, one of: ${context.get('enum')}`,
    // receives `schema` as context, e.g. use `context.get('oneOf')` to add more infos:
    [ERROR_ONE_OF_INVALID]: () => `Please choose a valid entry.`,
    [ERROR_DUPLICATE_ITEMS]: 'Remove duplicate entries',
    [ERROR_NOT_FOUND_CONTAINS]: 'Minimum one entry must exist like specified',
    [ERROR_MIN_LENGTH]: (context) => `Min. Length: ${typeof context.get('min') !== 'undefined' ? context.get('min') : typeof context.get('exclMin') !== 'undefined' ? context.get('exclMin') + 1 : '-'}`,
    [ERROR_MAX_LENGTH]: (context) => `Max. Length: ${
        typeof context.get('max') !== 'undefined' ? context.get('max') :
            typeof context.get('exclMin') !== 'undefined' ? context.get('exclMin') - 1 :
                typeof context.get('exclMax') !== 'undefined' ? context.get('exclMax') - 1 : '-'
    }`,
    [ERROR_MULTIPLE_OF]: (context) => `Must be multiple of ${context.get('multipleOf')}`,
    [ERROR_PATTERN]: (context) => `Input is invalid, must ${context.getIn(['patternError', 'en']) || ('match ' + context.get('pattern'))}`,
    [ERROR_WRONG_TYPE]: (context) => `Wrong type, expected ${typeToString(context.get('type'))} and got ${context.get('actual')}`,
    [ERROR_ADDITIONAL_ITEMS]: 'Must have only specified items, remove the additional.',
    [ERROR_ADDITIONAL_PROPERTIES]: 'Must have only specified properties, remove the additional.',
    [ERROR_MIN_CONTAINS]: (context) => `Must have at least ${context.get('minContains')} occurrences of the specified element`,
    [ERROR_MAX_CONTAINS]: (context) => `Must have at max. ${context.get('maxContains')} occurrences of the specified element`,
}
