# Localization of UI-Schema

Checkout the [dictionary package](#dictionary-package)!

> ❗ These components will have a breaking change in `v0.4.0`, split up into own modules, [see issue](https://github.com/ui-schema/ui-schema/issues/100)

## Translation

The `t` prop of `UIMetaProvider` and `UIGenerator` supports complex translators for dynamic translations and with any translation library.

> In your own widgets any translation lib can be used directly, when contributing to a design system use one of:
> - `{ t } = useUIMeta()`
> - `Trans`/`TransTitle`

```jsx harmony
import {relT} from '@ui-schema/ui-schema/Translate/relT';
import {Translator} from '@ui-schema/ui-schema/Translate/makeTranslator';
import {UIMetaProvider} from '@ui-schema/ui-schema/UIMeta';

/**
 * @var {Translator} translate
 */
const translate = (text, context, schema) => {
    // locale can be empty or the string of the current locale
    // for handling the schema keyword `t`
    const schemaT = relT(schema, context, locale);
    if(schemaT) return schemaT;

    // your custom translator function
    return translator(text, context, schema)
};

// pass down, depending how you use in either of:
<UIGenerator t={translate}/>

<UIMetaProvider t={translate}/>
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

Translating widgets can be done using `const {t} = useUIMeta();` hook directly, but recommended is the `Trans` component.

### Trans Component

The `Trans` component, accepts `text`:`{string}`, `context`:`{Map|undefined}` and `schema`:`{Map|undefined}`, connects to the `t` function of the parent UIGenerator.

#### Example Widget Translation

First example `DemoWidget` is translating a widgets title, supporting a custom translation library, schema `title`, `t` and `tt` keywords, see also [TransTitle](#example-transtitle).

Second example `DemoEnumWidget` is translating a widgets enum values, supporting a custom translation library.

```jsx harmony
import React from "react";
import {Map, List} from "immutable";
import {Trans, beautifyKey} from '@ui-schema/ui-schema';
import {getTranslatableEnum} from '@ui-schema/ui-schema/Translate';

const DemoWidget = ({ownKey, schema, storeKeys,}) => {
    return <Trans
        schema={schema.get('t')}
        text={schema.get('title') || storeKeys.insert(0, 'widget').push('title').join('.')}
        context={Map({'relative': List(['title'])})}
        fallback={schema.get('title') || beautifyKey(ownKey, schema.get('tt'))}
    />
};

const DemoEnumWidget = ({ownKey, schema, storeKeys,}) => {
    const enum_val = schema.get('enum');
    return enum_val.map((enum_name, i) => {
        const relative = List(['enum', getTranslatableEnum(enum_name)]);
        return <span key={i}>
            <Trans
                schema={schema.get('t')}
                text={storeKeys.insert(0, 'widget').concat(relative).join('.')}
                context={Map({'relative': relative})}
                fallback={beautifyKey(getTranslatableEnum(enum_name), schema.get('ttEnum'))}
            />
        </span>
    }).valueSeq() // as `enum_val` is an immutable list, this converts the map to an array compatible structure
};
```

#### Example TransTitle

The above example can be used to translate enum and anything, as titles are often used and offer a generic way, the component `TransTitle` can be used also.

```jsx harmony
import React from "react";
import {TransTitle} from '@ui-schema/ui-schema/Translate/TransTitle';

const DemoWidget = ({ownKey, schema, storeKeys,}) => {
    return <TransTitle
        schema={schema}
        storeKeys={storeKeys}
        ownKey={ownKey}
    />
};
```

#### Example Error Translation

Each design-system includes helper component for error translations, this way you can build your own:

```jsx harmony
import React from "react";
import FormHelperText from "@material-ui/core/FormHelperText";
import {Trans} from '@ui-schema/ui-schema/Translate/Trans';

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

### Immutable as Dictionary

UI-Schema includes a very simple, small and powerful **immutable based localization** logic, this can be used to **bundle your translations** with the app or to supply only the **default translations**.

```jsx harmony
import React from "react";
import {
    createMap, UIGenerator,
    ERROR_NOT_SET,
} from "@ui-schema/ui-schema";
import {makeTranslator} from "@ui-schema/ui-schema/Translate/makeTranslator";

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
        AccountBox: () => <svg>
            <path/>
        </svg>
    },
});

// using `makeTranslator` to build a function that knows the english dictionary
//   and can work with the schema `t` keyword
const tEN = makeTranslator(dictionary, 'en');

// this generator is using english translations for e.g. error messages
export const LocalizedGenerator = p =>
    <UIGenerator t={tEN} {...p}/>
```

> ❗ the function `makeTranslator` was named `t` up to `v0.2.0-rc.0`, the exported function `t` (not keyword, not property) will be removed in `v0.3.0`

### Translation in schema

Keyword `t` is not default JSON-Schema, it is a `object` containing multiple or one language with multiple translation keys, which may be nested.

> should work with dynamic properties/values in the future

```json
{
    "t": {
        "title": "Some english text"
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
            "title": "Some english text"
        }
    }
}
```

For `enum` values the `enum` sub-key is used together with an own `ttEnum` for transformations:

```json
{
    "t": {
        "de": {
            "enum": {
                "service": "Dienstleistung"
            }
        },
        "en": {
            "enum": {
                "service": "Service"
            }
        }
    },
    "ttEnum": true
}
```

## Dictionary Package

Some widgets are using labels by default, also default error messages are existing, those should be translated for each usage.

Checkout the `@ui-schema/dictionary` [sources](https://github.com/ui-schema/ui-schema/tree/master/packages/dictionary) to see the used/needed translations, or simply use it directly!

> Created another language? A pull request to share it with us would be awesome!

```bash
npm i --save @ui-schema/dictionary
```

```jsx
import React from 'react';
import AccountBox from '@material-ui/icons/AccountBox';
import {createMap} from '@ui-schema/ui-schema/Utils/createMap'
import {makeTranslator} from '@ui-schema/ui-schema/Translate/makeTranslator';
import * as en from '@ui-schema/dictionary/en'
import * as de from '@ui-schema/dictionary/de'

// for material-ui only icons which are set manually through schema are needed to add here
const icons = {
    'AccountBox': () => <AccountBox/>,
};

const dicEN = createMap({
    error: en.errors,
    labels: {...en.labels, ...en.richText},
    icons,
    widget: {}, // overwrite single widget translations
    titles: {}, // overwrite specific titles all the time (no matter in which widget)
});

const dicDE = createMap({
    error: de.errors,
    labels: {...de.labels, ...de.richText},
    icons,
    widget: {},
    titles: {},
});

const tEN = makeTranslator(dicEN, 'en');
const tDE = makeTranslator(dicDE, 'de');

const browserT = (text, context, schema) => {
    // using either some custom language in `localStorage` or the browser language
    // here you can also intercept and use any other translation library (maybe you need to add this inside an useEffect/useCallback)
    const locale = window.localStorage.getItem('locale') || navigator.language;
    return locale === 'de' ? tDE(text, context, schema) : tEN(text, context, schema);
};

export {browserT}
```

## LTR - RTL

❌ Currently only LTR is supported by the bindings, RTL will be added in the future - happy for pull requests!

Design systems should support both, the Material-UI library supports it.

## Text Transform

When no translation should be used, but e.g. the property names should simply be in uppercase, `tt` influence the text-transformation - primary for the widget title (and not widget values).

These keywords are intended for title & labels, not for formatting data. `tt` for property names and `ttEnum` for formatting value data. The `Select` widget title can be changed with `tt` and the dropdown values display format with `ttEnum`.

- `tt: true` uses `beautifyKey` for optimistic beautification (default)
- `tt: false | ''` disables optimistic beautification, `undefined` doesn't!
- `tt: 'ol'` the property name must be a `number`, increments it and adds a `.` dot at the end, useful for array/list labeling
- `tt: 'upper'` turns all letters in UPPERCASE
- `tt: 'lower'` turns all letters in lowercase
- `tt: 'upper-beauty'` applies optimistic-beautification and turns all letters in UPPERCASE
- `tt: 'lower-beauty'` applies optimistic-beautification and turns all letters in lowercase
- `tt: 'beauty-text'` will only beautify if the value is not-a-number after `* 1`, usefull for mixed values in e.g. `enum` with `"-1", "1", "+1"`
- `tt: 'beauty-igno-lead'` will only beautify after no `.-_` was found, prepending the value again, useful for `-new.name` to `-New Name`
- `tt: 'no-special'` will only print normal a-Z 0-9 chars ❌
- `tt` should support `boolean`, `string` and `array|List` ❌
- `tt` should support inheritance through the schema (define one-time per schema) ❌

### Optimistic Beautification

This handles creating beauty names out of property names or other code-language influenced namings. Thus simple schemas don't need any translation, the property names can be used instead.

The process is as follows:

- if not string, don't do anything
- replace:
    - `_` with a space
    - `.` with a space
    - `-` with a space
    - `  ` (double spaces) with a single space
- find words, anything that is separated by spaces
- uppercase the first letter of each found word
- removing duplicate spaces

### getTranslatableEnum

Transforms `enum` values to translatable values, currently doesn't do much, used mostly where `ttEnum` is used.

Transformations:

- `boolean` to `yes`/`no`
- `null` to `null`
