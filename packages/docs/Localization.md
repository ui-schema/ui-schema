# Localization of UI-Schema

## Translation

❌ Concept, not implemented

Supplying the `t` prop to an `SchemaEditor` enables dynamic translations and connection with some translation libraries, just pass in a function.

```jsx harmony
<SchemaEditor t={(key, data) => translate(key, data)}/>
``` 

- `key` is a selector like `error.is-required`
- `data` is optional data which may be used in the sentence
    - e.g. `widget.list.current-no` should describe how many entries are in an list/array 
    - can be translated with `Currently 6 entries are in the list.`
    - data would be simply `6`

### Translation in schema

❌ Concept, not implemented

Keyword `t` is not default JSON-Schema, UI-Schema defines it as an 'string' or 'one or two-dimension object' containing multiple or one language with multiple translation keys.

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

## LTR - RTL

Currently only LTR is supported by the bindings, RTL will be added in the future - happy for pull requests!

Design systems should support both, the Material-UI library supports it.

## Docs

- [Overview](../../README.md)
- [UI-JSON-Schema](./Schema.md)
- [Widget System](./Widgets.md)
- [Schema-Plugins](./SchemaPlugins.md)
- [Localization / Translation](./Localization.md)
- [Performance](./Performance.md)
