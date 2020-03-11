# Localization of UI-Schema

## Translation

>
> ✔ working, not expected to change (that much) breaking in the near future
>

Supplying the `t` prop to a `SchemaEditor` enables dynamic translations and connecting any translation library.

Native HTML inputs can use [native translations](#native-translation) for some validations.

> In your own widgets any translation lib can be used directly, if publishing it is recommended to use `t` / `Trans`

```jsx harmony
// for handling the schema keyword `t`
import {relT} from '@ui-schema/ui-schema';

const translate = (text, context, schema) => {

    // locale can be empty or the string of the current locale    
    const schemaT = relT(schema, context, locale);
    if(schemaT) return schemaT;
   
    // your custom translator 
    return translator(text, context)
};

<SchemaEditor t={translate}/>
``` 

- `text` is a string like 
    - `error.is-required` for error labels
    - `icon.<name>` for icons
    - `widgets.<storeKeys>.title` for widget titles and e.g. `widgets.<storeKeys>.enum.<value>` for enum (e.g. select values)
- `context` is optional data which may be used in the sentence
    - is an immutable `Map`
    - e.g. `context.get('min')` is used in the min-max validation error
        - can be translated with `Minimum Length: 6`
        - value would be `6`
    - widgets title/value translation have the context `relative`, which contains e.g. `title` or `enum.<value>`
- `schema` is the content of the schema keyword `t`
- **return** of `t` can be:
    - simple `string`
    - a `function` that creates the string
    - a `function` that creates a React component
    - as example of valid translations see [immutable as dictionary](#immutable-as-dictionary)
    - falsy value / undefined if e.g. `Trans` `fallback` should be used
    
Translating widgets can be done using `const {t} = useEditor();` hook directly, but recommended is the `Trans` component.

### Trans Component
 
The `Trans` component, accepts `text`:`{string}`, `context`:`{Map|undefined}` and `schema`:`{Map|undefined}`, connects to the `t` function of the parent SchemaEditor.

#### Example Widget Translation

Translating a widgets title, supporting a custom translation library, schema `t` and `tt` keywords:

```jsx harmony
import React from "react";
import {Map, List} from "immutable";
import {Trans, beautifyKey} from '@ui-schema/ui-schema';

const DemoWidget = ({ownKey, schema, storeKeys,}) => {
    return <Trans
        schema={schema.get('t')}
        text={storeKeys.insert(0, 'widget').push('title').join('.')}
        context={Map({'relative': List(['title'])})}
        fallback={beautifyKey(ownKey, schema.get('tt'))}
    />
};
```

The above example can be used to translate enum and anything, as titles are often used and offer a generic way, the component `TransTitle` can be used also:

```jsx harmony
import React from "react";
import {TransTitle} from '@ui-schema/ui-schema';

const DemoWidget = ({ownKey, schema, storeKeys,}) => {
    return <TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/>
};
``` 

#### Example Error Translation

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
            // errors need no fallback and no schema keyword `t` or `tt` support
        />
    </FormHelperText>
};
```

### Native Translation

> ❌ concept only added in MUI StringRenderer

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

> ✔ working, not expected to change (that much) breaking in the near future

UI-Schema includes a very simple, small and powerful **immutable based localization** logic, this can be used to **bundle your translations** with the app or to supply only the **default translations**.

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
    },
    icons: {
        AccountBox:() => <svg><path/></svg>
    },
});

// using `t` to build a function that knows the english dictionary
//   and can work with the schema `t` keyword
const tEN = t(dictionary, 'en');

// this editor is using english translations for e.g. error messages
const LocaleEditor = p =>
    <SchemaEditor t={tEN} {...p}/>

export {LocaleEditor}
```

### Translation in schema

> ✔ working, not expected to change (that much) breaking in the near future

Keyword `t` is not default JSON-Schema, it is a `object` containing multiple or one language with multiple translation keys, which may be nested. 

> should work with dynamic properties/values in the future

```json
{
  "t": {
    "title":  "Some english text"
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

### List of used keys

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

❌ Currently only LTR is supported by the bindings, RTL will be added in the future - happy for pull requests!

Design systems should support both, the Material-UI library supports it.

## Text Transform

When no translation should be used, but e.g. the property names should simply be in uppercase, `tt` influence the text-transformation - primary for the widget title (and not widget values).

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
    - `__` with a space
    - `_` with a space
    - `.` with a space
    - `-` with a space
- find words, anything that is separated by spaces
- uppercase the first letter of each found word
- removing duplicate spaces
