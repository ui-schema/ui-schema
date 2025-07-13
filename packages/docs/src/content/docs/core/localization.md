---
docModule:
    package: '@ui-schema/ui-schema'
    modulePath: "ui-schema/src/"
    # fromPath: "Translator"
    files:
        - "Translator/*"
        - "TranslatorRelative/*"
        - "getTranslatableEnum/*"
---

# UI-Schema Core Localization Helper

Checkout the [in-schema localization guide](/docs/localization) and [how localization works in react](/docs/react/localization) - and the [dictionary package](#dictionary-package)!

### Immutable as Dictionary

UI-Schema includes a very simple, small and powerful **immutable based localization** logic, this can be used to **bundle your translations** with the app or to supply only the **default translations**.

```jsx
import React from 'react';
import { ERROR_NOT_SET } from '@ui-schema/json-schema/Validators'
import { createMap } from '@ui-schema/ui-schema/createMap';
import { makeTranslator } from '@ui-schema/ui-schema/Translator';

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
const t = makeTranslator(dictionary);

// make a translator that supports schemas withs multiple embedded languages,
// enable the needed translator based on user preference.
// (see below schema examples on the difference)
const tEN = makeTranslator(dictionary, 'en');

// use down `t`/`tEN` where a translator is supported, like in react UIMetaProvider
// <UIMetaProvider t={tEN} />
```

> ❗ the function `makeTranslator` was named `t` up to `v0.2.0-rc.0`, the exported function `t` (not keyword, not property) was removed in `v0.3.0`

## Dictionary Package

Some widgets are using labels by default, also default error messages are existing, those should be translated for each usage.

Checkout the `@ui-schema/dictionary` [sources](https://github.com/ui-schema/ui-schema/tree/master/packages/dictionary) to see the used/needed translations, or simply use it directly!

> Created another language? A pull request to share it with us would be awesome!

```bash
npm i --save @ui-schema/dictionary
```

```jsx
import React from 'react';
import AccountBox from '@mui/icons-material/AccountBox';
import { createMap } from '@ui-schema/ui-schema/createMap'
import { makeTranslator } from '@ui-schema/ui-schema/Translate/makeTranslator';
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

export { browserT }
```
