# Todos for JSON-Schema

> rewrite of validator system and errors
> - logic especially in `/json-schema` and `/react` (legacy plugins)
> - types in system, and validate/errors interop
> - misc in `/react`, `/ds-*`

- `/Validators`
    - [x] ArrayValidator
        - [x] migrated to `.output`
        - [x] support `recursive`
        - [x] add params for adding keywordLocation/instanceLocation at all `addError` / verify usage for nested errors
        - [x] support handling of `prefixItems`
        - [x] support handling of `prefixItems` with additional `items`
        - [x] make `additionalItems` behaviour compatible for all versions (with `prefixItems`/`items`)
    - [x] EmailValidator
        - kind: `validate:boolean`
    - [x] MinMaxValidator
        - kind: `validate:void`
        - fixed draft-4 compatibility: previously for `exclusiveMinimum` only the `true` case was handled, while for `exclusiveMaximum` any `boolean` enforced the exclusive validation
        - [x] split up by value-type
        - [ ] add params for adding keywordLocation/instanceLocation at all `addError`
    - [x] MultipleOfValidator
        - kind: `validate:boolean`
    - [ ] ObjectValidator
        - [x] migrated to `.output`
        - [x] support `recursive`
        - [x] remove included `required` validator, as now separate plugin
        - [x] do recursive `validate` for properties (if enabled)
    - [ ] OneOfValidator
        - [x] migrated to `.output`
        - [x] forced `recursive`
            - [ ] add tests for `recursive`
        - [ ] not compliant, as uses first-valid, it does not validate that only a single schema is valid
            - by design, for performance
            - should support easy switching to a stricter version
    - [x] PatternValidator
        - kind: `validate:boolean`
    - [ ] RequiredValidator
        - new compliant required validator, while still non-compliant lookahead validation in non recursive runs
        - checks for existence of keys/undefined, instead of html-like
        - validated on object level, not on the field
        - **todo:** produced errors can't be easily consumed by the field they are intended for, see inline comments at validator
    - [x] RequiredValidatorLegacy
        - HTML-like required, which works directly on field-level value and not object
        - similar behaviour as in `0.4.x`
    - [ ] TypeValidator
        - kind: `validate:boolean`
        - refine how `undefined` is treated, for `string` in root level, it now fails for `undefined`
    - [x] ValueValidator
        - [x] ValueValidator-Const
            - kind: `validate:boolean`
            - improved object/array/Map/List support
        - [x] ValueValidator-Enum
            - kind: `validate:boolean`
    - [x] NotValidator
- `StandardValidators`
    - [ ] optimize / finalize bindings to `validate` fns
    - **todo:** try to rewrite the way nested validations are done, if the validator could return `deferred` and a `onDeferredDone`
        - it could allow writing a loop inside the main `validate`, which runs all validations instead of recursive stack increase,
          while `onDeferredDone` provides a way to do anything when it was done;
        - this would be complex when the `onDeferredDone` works on each-result and then on the accumulation of it,
          like at `array.contains`
- [ ] incremental hierarchical validation should be checked/tested
    - [x] array/object results checked
    - [x] expand array tests
    - [ ] expand object tests
    - [ ] expand `handleIfElseThen` tests?
    - [ ] expand `oneOfValidator` tests
    - [ ] check any conditional schema, which would never be validated in render flow, and activate recursive
    - ~~e.g. errors on array items are shown on error in list example~~ fixed, prevent `.items` keyword validation if `params.recursive` is false
- [ ] reduce "type checks" and "schema/keyword exists checks" inside validators
    - improve type inference based on `types` assignment of validator-bindings
- [x] add `validate` to UIMetaContext
    - migrate handleIfElseThen/ConditionalHandler/useSchemaCombine to binding from context
- write down effects of adjusted validations, as now more spec compliant
    - `required` works on object, not field -> `if/else/then` on `undefined` value behaves different than on `object
        - no longer has HTML-is-required internally as default
    - `type` now no longer used for some validators, only internal `valueType`
    - validators now are directly tied to `valueType` instead of needing to do such checks internally
    - strict-type validation based on path depth
    - `$ref` and resolving pointer is now more spec compliant, which fixes a lot, but also removes some previous behaviour
        - in `<=0.4.x` the `$ref`: `'#/definitions/person'` and `$ref: '#/$defs/person'`  where treated as the same and resolved by the nearest `definitions` or `$defs`; now those are treated as pointer and not as definition aliases, thus two different schema locations would be tried
- [ ] verify all pass downs of `params` to not pass down e.g. `instanceKey` when switching instances
- [ ] verify all pass downs of `params` to pass down `parentSchema`, for legacy/HTML-like required checks AND not pass it down where it no longer is applicable
- [ ] split up `StandardValidators` in own files
- [ ] add `id` to every validator
- **todo:** rethink/redo validation based on "rendered by schema/value"
    - as rendering happens by schema, `undefined` is often validated, atm. `undefined` skips different validators due to not knowing if really exists
      or if the field just is empty
    - especially `root` should never skip e.g. `type` validation for `undefined`
    - if a field exists, it should be validated, but atm. only known "if not undefined"
      resulting in `if/then/else` not correctly handling type-mismatches
    - if a field does not exist, it shouldn't be validated at all, except through keywords from the parent, which target it
    - conclusion:
        - atm. this is only possible inside `handleIfElseThen`
        - full support requires full-store validation and not incremental,
          or when the incremental gets more meta information, e.g. `valueExists` in `object` on `property` level could "turn validation on" for that property;
        - workaround: using `path.length` to switch to strict-type-validate, using `instanceLocation: []` for `handleIf`,
          which fails for `undefined` if anything is defined in `type` keyword
        - **todo:** add path expansion inside current validators
    - AJV behaves inconsistent with `undefined`
        - if the root is `undefined` and has no `type`: valid
        - if the root is `undefined` and has `type: 'object'`: invalid
        - if a property `demo` is `undefined` and has `type: 'string'`: valid
