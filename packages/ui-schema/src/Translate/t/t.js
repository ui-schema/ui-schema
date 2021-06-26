import {makeTranslator} from '@ui-schema/ui-schema/Translate/makeTranslator';

/**
 * Dictionary Factory
 * pass in the dictionary that should be used, returns a new function that can work with it.
 * - supports strings or functions as translation
 * - supports relative schema translation (keyword `t`)
 * - translation results should either be strings or React Components
 *
 * @param {Map} dictionary imputable map with translations for one language
 * @param {string} locale
 * @deprecated in 0.2.0-rc, will be removed in 0.3.0
 * @return {function(string, {}): string|React.ComponentType}
 */
export const t = makeTranslator
