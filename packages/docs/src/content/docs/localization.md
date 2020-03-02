# Localization of UI-Schema

## Translation

>
> ✔ working, not expected to change (that much) breaking in the near future
>

Supplying the `t` prop to a `SchemaEditor` enables dynamic translations and connection with any translation library, just pass in a function and default widgets get translated.

Native HTML inputs can use [native translations](#native-translation) for some validations.

> In your own widgets of cause any translation lib can be used directly, if publishing we recommend to only use `t`

```jsx harmony
<SchemaEditor t={(text, context) => translate(key, data)}/>
``` 

- `text` is a string like `error.is-required`
- `context` is optional data which may be used in the sentence
    - is an immutable `Map`
    - e.g. `context.get('min')` is used in the min-max validation error 
        - can be translated with `Minimum Length: 6`
        - value would be `6`
- **return** of `t` can be:
    - simple `string`
    - a `function` that creates the string
    - a `function` that creates a React component
    - as example of valid translations see [immutable as dictionary](#immutable-as-dictionary)
    
Translating in your widget can be done using `useSchemaTrans` hook or the `withTrans` HOC.
 
Or by simply using the `Trans` component, it also accepts `text` and `context`, inside it connects to the `t` of the parent SchemaEditor.

```jsx harmony
import React from "react";
import FormHelperText from "@material-ui/core/FormHelperText";
import {Trans} from '@ui-schema/ui-schema';

const LocaleHelperText = ({text, schema, context}) => {
    return <FormHelperText>
        <Trans
            text={text}
            context={
                /* adding some default stuff to the context which may be needed */
                context.set('type', schema.get('type'))
                    .set('widget', schema.get('widget'))
            }
        />
    </FormHelperText>
};
```

### Native Translation

Native browser translation is coupled to native-validation, thus only what browser can test, can be translated this way.

It is helpful for simple forms which don't rely on complexer data models or validations.

Adding the `t` keyword (not property) in a schema with `browser`, enables HTML translations.

Native translation is limited to the following errors, only possible after first manual change, and one-message at all.

- `valueMissing`
- `typeMismatch`
- `patternMismatch`
- `tooLong`
- `tooShort`
- `rangeUnderflow`
- `rangeOverflow`
- `stepMismatch`
- `badInput`

Let the browser handle "incorrect email" message:

```json
{
    "type": "string",
    "format": "email",
    "t": "browser"
}
```

### Immutable as Dictionary

>
> ✔ working, not expected to change (that much) breaking in the near future
>

UI-Schema includes a very simple, small and powerful immutable based localization logic, this can be used to bundle your translations with the app or to supply only the default translations.

```jsx harmony
import React from "react";
import {
    t, createMap, SchemaEditor,
    ERROR_NOT_SET,
} from "@ui-schema/ui-schema";

const dictionary = createMap({
    error: {
        // ... add what you need

        // usage with string
        [ERROR_NOT_SET]: 'Please fill out this field',
        
        // usage with function that generates the string, using the context
        [ERROR_MULTIPLE_OF]: (context) => `Must be multiple of ${context.get('multipleOf')}`,

        // usage with function, using the context, producing a React functional component
        [ERROR_MULTIPLE_OF]: (context) =>
                            () => <span>Must be multiple of <u>{context.get('multipleOf')}</u></span>,
    }
});

// using `t` to build a function that knows the english dictionary
const tEN = t(dictionary);

// this editor is using english translations for e.g. error messages
const LocaleEditor = p =>
    <SchemaEditor t={tEN} {...p}/>

export {LocaleEditor}
```

### Translation in schema

❌ Concept, not implemented

Keyword `t` is not default JSON-Schema, UI-Schema defines it as an 'string' or 'one or two-dimension object' containing multiple or one language with multiple translation keys.

- if `t` is `browser`, when existing the e.g. browser error messages will be used 

> must work with dynamic properties

```json
{
  "t": "Some english text"
}
```

```json
{
  "t": {
    "de": "Irgendein deutscher Text",
    "en": "Some english text"
  }
}
```

```json
{
  "t": {
    "de": {
      "title": "Irgendein deutscher Text"
    },
    "en": {
      "title":  "Some english text"
    }
  }
}
```

## List of used keys

In some widgets labels are included by default, also default error messages are existing, those should be translated for each usage.

> todo: create list of those
>
> todo: create `@ui-schema/translation` with common and error translations

These are the used error messages:

```js
import {
    ERROR_CONST_MISMATCH, ERROR_DUPLICATE_ITEMS, ERROR_ENUM_MISMATCH,
    ERROR_MAX_LENGTH, ERROR_MIN_LENGTH, ERROR_MULTIPLE_OF, ERROR_NOT_FOUND_CONTAINS,
    ERROR_NOT_SET, ERROR_PATTERN, ERROR_WRONG_TYPE
} from "@ui-schema/ui-schema";

// e.g. for `ERROR_CONST_MISMATCH` the value is `const-mismatch`, will pushed to `t` like:
//    text:           error.const-mismatch
//    context:        {const: <value-expected>}
//    translate like: (context) => `Expected value is ${context.get('const')}`,
```

## LTR - RTL

Currently only LTR is supported by the bindings, RTL will be added in the future - happy for pull requests!

Design systems should support both, the Material-UI library supports it.

## Text Transform

When no translation should be used, but e.g. the property names should simply be in uppercase, `tt` influence the text-transformation.

- `tt: true` uses `beautifyKey` for optimistic beautification (default) ✔
- `tt: false | 0 | ''` disables optimistic beautification, `undefined` doesn't! ✔
- `tt: 'ol'` the property name must be a `number`, increments it and adds a `.` dot at the end, useful for array/list labeling ✔
- `tt: 'upper'` turns all letters in UPPERCASE ✔
- `tt: 'lower'` turns all letters in lowercase ✔
- `tt: 'upper-beauty'` applies optimistic-beautification and turns all letters in UPPERCASE ✔
- `tt: 'lower-beauty'` applies optimistic-beautification and turns all letters in lowercase ✔
- `tt: 'no-special'` will only print normal a-Z 0-9 chars ❌
- `tt` should support `boolean`, `string` and `array|List` ❌
- `tt` should support inheritance through the schema (define one-time per schema) ❌

### Optimistic Beautification

This handles creating beauty names out of property names or other code-language influenced namings. Thus simple schemas don't need any translation, the property names can be used instead.

The process is as follows:

- if not string, don't do anything
- replace:
    - `__` against a ` ` space
    - `_` against a ` ` space
    - `.` against a ` ` space
    - `-` against a ` ` space
- find words, anything that is separated by spaces
- uppercase the first letter of each found word
