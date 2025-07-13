---
docModule:
    package: '@ui-schema/react'
    modulePath: "react/src/"
    # fromPath: "UIMeta"
    files:
        - "Translate/*"
        - "TranslateTitle/*"
---

# Localization in UI-Schema React

Checkout the [in-schema localization guide](/docs/localization) and [core localization helper](/docs/core/localization)!

## Translation

The `t` prop of `UIMetaProvider` and `UIGenerator` supports complex translators for dynamic translations with any translation library.

> In your own widgets any translation lib can be used directly, when contributing to a design system use one of:
> - `{ t } = useUIMeta()`
> - `Translate`/`TranslateTitle`

to support just the `t` keyword, with a single locale:

```jsx harmony
import {relTranslator} from '@ui-schema/ui-schema/Translate/relT';
import {UIMetaProvider} from '@ui-schema/ui-schema/UIMeta';

<UIMetaProvider t={relTranslator}/>
```

to support custom translators and the `t` keyword with multi-locale:

```jsx harmony
import { relT } from '@ui-schema/ui-schema/Translate/relT';
import { Translator } from '@ui-schema/ui-schema/Translate/makeTranslator';
import { UIMetaProvider } from '@ui-schema/ui-schema/UIMeta';

/**
 * @var {Translator} translate
 */
const translate = (text, context, schema) => {
    // locale must be be empty for single locale `t` keyword,
    // or the string of the current locale for mutli-locale `t` keyword
    const schemaT = relT(schema, context, locale);
    if(schemaT) return schemaT;

    // your custom translator function
    return translator(text, context, schema)
};

<UIMetaProvider t={translate}/>
```

- `text` is a string like
    - `error.is-required` for error labels
    - `icon.<name>` for icons
    - `widgets.<storeKeys>.title` for widget titles and e.g. `widgets.<storeKeys>.enum.<value>` for enum (e.g. select values)
- `context` is optional data which may be used in the sentence
    - is an immutable `Map`
    - e.g. `context.get('min')` is used in the min-max validation error
        - can be used liked `'Minimum Length: ' + context.get('min')`
        - e.g. creates `Minimum Length: 6`, value would be `6`
    - widgets title/value translation use the context `relative`, which contains e.g. `title` or `enum.<value>`
        - for examples check the [example widget translation](#example-widget-translation)
- `schema` is the schema-level of the current to be translated element
- **return** of `t` can be:
    - simple `string`
    - a `function` that creates the string
    - a `function` that creates a React component
    - as example of valid translations see [immutable as dictionary](#immutable-as-dictionary)
    - falsy value / undefined if e.g. `Translate` `fallback` should be used

Translating widgets can be done using `const {t} = useUIMeta();` hook directly, but recommended is the `Translate` component.

### Translate Component

The `Translate` component, accepts `text`:`{string}`, `context`:`{Map|undefined}` and `schema`:`{Map|undefined}`, connects to the `t` function of the parent UIGenerator.

#### Example Widget Translation

First example `DemoWidget` is translating a widgets title, supporting a custom translation library, schema `title`, `t` and `tt` keywords, see also [TranslateTitle](#example-TranslateTitle).

Second example `DemoEnumWidget` is translating a widgets enum values, supporting a custom translation library.

```jsx harmony
import React from "react";
import {Map, List} from "immutable";
import {Translate, beautifyKey} from '@ui-schema/ui-schema';
import {getTranslatableEnum} from '@ui-schema/ui-schema/Translate';

const DemoWidget = ({schema, storeKeys}) => {
    return <Translate
        schema={schema.get('t')}
        text={schema.get('title') || storeKeys.insert(0, 'widget').push('title').join('.')}
        context={Map({'relative': List(['title'])})}
        fallback={schema.get('title') || beautifyKey(storeKeys.last(), schema.get('tt'))}
    />
};

const DemoEnumWidget = ({schema, storeKeys}) => {
    const enum_val = schema.get('enum');
    return enum_val.map((enum_name, i) => {
        const relative = List(['enum', getTranslatableEnum(enum_name)]);
        return <span key={i}>
            <Translate
                schema={schema.get('t')}
                text={storeKeys.insert(0, 'widget').concat(relative).join('.')}
                context={Map({'relative': relative})}
                fallback={beautifyKey(getTranslatableEnum(enum_name), schema.get('ttEnum'))}
            />
        </span>
    }).valueSeq() // as `enum_val` is an immutable list, this converts the map to an array compatible structure
};
```

#### Example TranslateTitle

The above example can be used to translate anything, as titles are often used and offer a generic way, the component `TranslateTitle` can be used also, which works identically to the above example.

```jsx harmony
import React from "react";
import {TranslateTitle} from '@ui-schema/ui-schema/Translate/TranslateTitle';

const DemoWidget = ({schema, storeKeys}) => {
    return <TranslateTitle
        schema={schema}
        storeKeys={storeKeys}
    />
};
```

#### Example Options Translation

> todo: add example using the `useOptionsFromSchema` strategy for universal `enum`/`oneOf` support; currently only in ds-material

#### Example Error Translation

Each design-system includes helper component for error translations, this way you can build your own:

```jsx harmony
import React from "react";
import FormHelperText from "@mui/material/FormHelperText";
import {Translate} from '@ui-schema/ui-schema/Translate/Translate';

const LocaleHelperText = ({text, schema, context}) => {
    return <FormHelperText>
        <Translate
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
