# Validators

> Also check [the plugin concepts](/docs/plugins) and how to ~~(todo) create validators~~.

> 🚧 This page does not reflect the new 0.5.x validators, only copied the prev. 0.4.x validator docs.

This page lists and explains the included plugins and validators.

## Validation Plugins

| Plugin                                      | Package              | Validity Fn.       | Handles                                                         | Added Props                   |
|:--------------------------------------------|:---------------------|:-------------------|:----------------------------------------------------------------|:------------------------------|
| minMaxValidator                             | @ui-schema/ui-schema | validateMinMax     | min/max validity                                                | `valid`, `errors`             |
| typeValidator                               | @ui-schema/ui-schema | validateType       | keyword `type`                                                  | `valid`, `errors`             |
| valueValidatorConst                         | @ui-schema/ui-schema | validateConst      | keywords `const`                                                | `valid`, `errors`             |
| valueValidatorEnum                          | @ui-schema/ui-schema | validateEnum       | keywords `enum`                                                 | `valid`, `errors`             |
| [multipleOfValidator](#multipleofvalidator) | @ui-schema/ui-schema | validateMultipleOf | keywords `type:number,integer`, `multipleOf`                    | `valid`, `errors`             |
| [patternValidator](#patternvalidator)       | @ui-schema/ui-schema | validatePattern    | keywords `type:string`, `pattern`                               | `valid`, `errors`             |
| oneOfValidator                              | @ui-schema/ui-schema | validateOneOf      | keywords `type:*`, `oneOf`                                      | `valid`, `errors`             |
| arrayValidator                              | @ui-schema/ui-schema |                    | `type:array`                                                    | `valid`, `errors`             |
| objectValidator                             | @ui-schema/ui-schema |                    | `type:object`, keywords `additionalProperties`, `propertyNames` | `valid`, `errors`             |
| requiredValidator                           | @ui-schema/ui-schema | checkValueExists   | keywords `type:object`, `required`                              | `valid`, `errors`, `required` |
| emailValidator                              | @ui-schema/ui-schema |                    | keywords `type:object`, `required`                              | `valid`, `errors`             |

Using default validators:

```js
import {
    PluginSimpleStack, validators,
    ValidityReporter
} from '@ui-schema/ui-schema';

const widgets = {
    widgetPlugins: [
        // ... other plugins
        PluginSimpleStack, // executes the `pluginSimpleStack`
        ValidityReporter,  // after `PluginSimpleStack`
        // ... other plugins
    ],
    pluginSimpleStack: validators,
};

export {widgets};
```

### multipleOfValidator

Applies some custom float to not-float conversions to - according to tests - mitigate some JS precision issues, previously  `multipleOf: 0.01` against a value of `0.07` was "invalid". Currently the precision limit is `9`.

### patternValidator

For human understandable translation of patterns, you can specify the keyword `patternError`, this is passed as context down to the translator. When not specified shows the `pattern` keyword.

Default multi-language support:

```json
{
    "pattern": "^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$",
    "patternError": {
        "en": "be a valid zip code",
        "de": "eine gültige PLZ"
    }
}
```

Results in the translation: `Input is invalid, must be a valid zip code`, `Eingabe nicht korrekt, benötigt eine gültige PLZ` for `@ui-schema/dictionary`.
