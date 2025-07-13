# Localization in UI-Schema

Checkout the [core localization guide](/docs/core/localization) and [how localization works in react](/docs/react/localization)!

## Translation in schema

Keyword `t` is not default JSON-Schema, it is a `object` containing multiple or one language with multiple translation keys, which may be nested.

> should work with dynamic properties/values in the future [#182](https://github.com/ui-schema/ui-schema/issues/182)

### Basic Translations

The `.title` keyword can be localized, the default logic is to check for a translations and otherwise use the normal `.title` keyword or if none exist apply `beautifyKey`.

**Single language translations:**

```json
{
    "t": {
        "title": "Some english text"
    }
}
```

**Multi-language translations:**

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

### Translation of options

For `enum` values the `enum` sub-key is used together with an own `ttEnum` for transformations:

**Single language translations:**

```json
{
    "t": {
        "enum": {
            "service": "Dienstleistung"
        }
    },
    "ttEnum": true
}
```

**Multi-language translations:**

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
- `tt: 'beauty-text'` will only beautify if the value is not-a-number after `* 1`, usefully for mixed values in e.g. `enum` with `"-1", "1", "+1"`
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
