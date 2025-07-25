# Changes done

Tracking changes and progress for [v0.5.x](https://github.com/ui-schema/ui-schema/discussions/184#discussioncomment-3100010).

## Package Split up

> todo: add what was moved to which package/sub-path after first clean-up of a working demo-web/demo-server setup

## Renamed Code

List of renamed functions, components etc., most are also moved to other packages / paths - and some may be renamed/moved again until final `v0.5.0` release.

- `PluginSimple` > `SchemaPlugin`,
- `PluginSimpleStack` > `SchemaPluginsAdapter`,
- `PluginSimpleStack/handlePluginSimpleStack` > `SchemaPluginStack`
- `schemaToNative/mapSchema` > `schemaRulesToNative`
- `PluginStack` > `WidgetEngine`
- `ComponentPluginType` >`WidgetPluginType`
- `PluginProps` >`WidgetPluginProps`
- `WidgetProps` > `WidgetPayload` AND `WidgetProps`
- `CommonTypings/Errors` > `ValidatorErrorsType`
- `ObjectGroup` > `SchemaLayer`
- `Translate/Trans` > `Translate`
- `Translate/TransTitle` > `TranslateTitle`
- `Translate/relT` > `TranslatorRelative`
    - `relT` > `getSchemaTranslationRelative`
    - `relTranslator` > `translatorRelative`

## General Changes

### DS Material

- `WidgetBinding | WidgetsBinding | MuiWidgetsBinding` types, folder and file names normalized to be `/Binding`, `/BindingDefault`, `/BindingExtended`
- ~~previous `widgetsBinding.widgets` now exported with multiple modular functions:~~
    - ~~separate files in `WidgetsDefault`, to be able to only import the ones really used in your app~~
    - i~~mport all: `import * as WidgetsDefault from '@ui-schema/ds-material/WidgetsDefault'`~~
    - ~~import modular, e.g. `import {define} from '@ui-schema/ds-material/WidgetsDefault/define'`~~
    - ~~`define(partialBinding)` just generates the basic structure without any plugins or widgets~~
        - ~~accepts the rest of the binding as parameter~~
    - ~~`plugins()` returns ~~`schemaPlugins`~~ and `widgetPlugins`~~
    - ~~`widgetsTypes()` just returns `types` widgets~~
    - ~~`widgetsCustom()` just returns some recommended `custom` widgets~~
- previous `widgetsBinding.widgets` now exported as modular objects:
    - `ds-material/BindingDefault` (atm.) exports `typeWidgets` and `baseCompoents` (*maybe split up, but could need renaming of type or even widgets folders*)
    - `ds-material/BindingExtended` exports `bindingExtended` for `.custom` widget binding
    - no default `schemaPlugins`/`widgetPlugins`; *maybe add a legacy compat to make migration easier, atm. in demo-web*
- ~~added `Grid2` components and plugins, for future migration path from mui5/6 to 7~~
- added `GridItemPlugin` for mui v7, with `Grid['size']` property, *not using `Grid2`*, *not compatible with v5/6*
- [ ] list widgets, like GenericList, should reuse the components group, to be able to influence their grid component, as it must match what is then used in plugins
- fixed `forbidInvalidNumber`, prevented too much for keyboard control
- removed `react-uid` dependency
- optimize useOptionsFromSchema, add basic support for collecting options from nested oneOf/anyOf, apply normalization also on `const`, same like `enum`
- support `name` attribute generation on inputs
- fixed wrongly used required in table when deleting row

### DS Bootstrap

- switched to strict esm
- update `clsx` to v2 (peer-dep)
    - as v1 is not compatible with `moduleResolution: Node16`
- removed `react-uid` dependency
- css and html fixes, bootstrap 5
- support `name` attribute generation on inputs

### System

- new universal JS utils, system, SchemaPlugins, not coupled to react dependencies
- removed function `checkNativeValidity` in `schemaToNative`
- moved react-specific widget matching logic from `matchWidget` to `WidgetRenderer`
- `schemaTypeToDisctint`, used for matching widgets by `type` keyword, now supports multiple types
    - for `["string", "number"]` will now sort it and try to access a widget with the ID `number+string`, see default `matchWidget` source for entrypoint of general matching algo.
    - switched from `schemaTypeToDistinct` to `schemaTypeIs` for rendering decision checks, as for tests the new combined types can not be used
- new `schemaTypeIsDistinct` util for testing if the only allowed type, ignoring `null` if mixed with others (like `schemaTypeToDisctint`, as "null has no input use case")
- `matchWidget` now return identifiers about what has matched
- renamed `ErrorNoWidgetMatching` to `ErrorNoWidgetMatches`
- `input[name]` attribute generator with `storeKeys`, optional enabled via ui meta context
- new `getFields` function for normalized access to children keywords (array items/object properties)
    - with static fields retrieval, for value-less schema fields keywords normalization and resolving, like needed for the table widget (as columns must be known before rendering/having values and all rows must be uniform)

Todo:

- [ ] optimize errors typing
    - [x] reduce immutable usage
        - internal of Validator plugin system
        - simplified in props, yet still based on immutable for performance/no-render for same errors
    - [ ] improved with more information
        - [x] interoperable to spec - but not fully spec compliant
            - e.g. use object-tree for faster atomic value extraction, instead of arrays
            - e.g. include `context` for easier translation, instead of schema reference lookups while rendering errors
        - [ ] in typing
            - [x] base information
            - [ ] tree/nested information
        - [ ] in validators
- [x] simplified `ValidatorErrors`, less hierarchy, easier interface for adding own-errors, child-errors and retrieving them

### JSON-Schema

- new universal JS validation system, not coupled to react dependencies
- rewrite `ValidatorErrors` Record to a simpler `ValidatorOutput` class with simpler errors structure
    - switched `type` property to `error`
    - removed `getType` and other utils to get only specific types of error
    - only passing down the list of errors as props, not the whole `ValidatiorError`
    - for React: prop `errors` is created inside validator, now only exists when there is an error and is `undefined` otherwise
- `multipleOf` validator floating point number normalization now uses BigInt for better scaling

Todo:

- [x] new validator system
    - [x] to support version changing
    - [x] to support extending `validateSchema` (replaced with new `validate` function)
    - [x] to support the same validators everywhere, in every level
    - [ ] finalize, optimized and cleaned up
- [ ] access errors of fields which where evaluated on their parent
- [ ] validators: improve value typing and functions
    - atm. validators are often strictly typed, while they also must handle any unknown value to only validate the types they are compatible with
- [ ] new schema resource system
    - [x] finds all $ref and connects them
    - [x] allows resolving json-pointer against root branch
    - [x] provides support for $ref chains
    - [x] canonicalization of embedded $ref for better resolving in widgets
        - widgets can't resolve the actual branches, as they don't have a stable knowledge about their real position in complex schemas,
          caused by that, they must resolve the $ref themself when needed, to facilitate it the $ref must be canonicalized while building the schema resource
    - [x] interops with Validator for resolving `$ref` in validator and uses validate for traversing conditionals
    - [ ] better highlight what is important when using it: use the root branch value as schema (for having the prepared, and not the plain schema), check unresolved, use without `inject/applyWidgetEngine` HOCs to move schema root rendering component
    - [ ] create tests for circular `$ref` between separate remote schemas
- [ ] validator support of defaulting values, initially and after applying conditional schema
    - **tbd:** `default` handling and conditionals/selecting branches in ref/allOf/oneOf chains
- **TBD:** defaulting values may be needed during validation, to not flash invalid states, which requires some store-effects and bindings to `internals`
    - yet that should also be possible initially/on list actions - but how to handle conditions/composition/ref there?x
- [x] validator support of composition and conditional schemas
    - `if/then/else`, `allOf`, `oneOf`, `anyOf`
    - `dependencies`
    - support of nested conditionals / chains of `if` / including `$ref`
- [ ] something that collects for each valueLocation/schemaLocation it's applicable schema, for then having a list of schemas which should be merged, for each field/schema location
    - [x] basic PoC with emitting applied schemas for per-layer/non-recursive validation, with an integration in ValidatorPlugin which reduces applied schemas, not just merging them
    - [x] validators should return applicable schemas + evaluation context with evaluated-fields
        - if > adds then or else
        - allOf > return all
        - oneOf > return the first valid
        - anyOf > return the first valid
    - [x] validator plugin for ui-schema/react merges schemas more reliable
        - uses sub-schema which the validator collected in `applied`
        - e.g. finding intersection of `type`, `mininum`, `enum`, `required` etc.
        - special handling of sub-schemas, like same `properties` in different applied schemas, for deferred merging, once that particular layer will be validated, not when the `object` itself is validated
            - this guarantees that `{ "properties": { "country": { "$ref": "#/$defs/country" } }` works even if more `$ref` or dynamic branches exist in `if/then/else`, which produces something like the following, where a new `allOf` on those properties include the further `applied` schemas, which then can be resolved when the `country` property itself is validated.

              ```json
              {
                "properties": {
                  "country": {
                    "$ref": "#/$defs/country",
                    "allOf": [
                      { "$ref": "#/$defs/country_europe" }
                    ]
                  }
                }
              }
              ```
    - [ ] collect all applied canonical / pointer to know which are used after reduction
- [x] ValidatorHandler refactor signature to object for easier complex changes/other state-params mix
- [ ] validator support of evaluation context for more advanced use cases
    - [x] basic support of validation context with `evaluatedProperties`
    - [x] resolve and validate $ref with "all apply" strategy w/ configurable recursive support
        - collect evaluated fields, but only in e.g. `then/else`, not `if`
        - recursively resolve ref while going deeper
        - recursively validate while going back up
    - add some 'stack' for handling where some node is and how many are still open, before running e.g. after-all keywords like "unevaluated"?
        - they are "evaluate after current layer is evaluated"
    - [x] `unevaluatedProperties`
        - is applied only inside one schema location
        - in this example, the lower `"unevaluatedProperties": false` make `price` impossible, `{ "name": "A", "price": 123 }` is invalid for this schema:
        - ```json
          {
            "allOf": [
              {"properties": {"name": {"type": "string"}}, "unevaluatedProperties": false},
              {"properties": {"price": {"type": "number"}}}
            ],
            "unevaluatedProperties": false
          }
          ```
- [ ] rewrite the "Combination with Conditional" demo and explain why that is caused and how to prevent non-existing values from causing validations to not behave like expected with what is rendered
    - the point with e.g. `required` only validates if a value is `object`, not if the value is a `string` (and all other switch to `typeof` checks instead of `type` keyword),
      and as UI is rendered for the whole schema and not only for existing values, the validation must correctly cascade or `default` values must be set
        - "in json-schema by default a schema won't be evaluated further if the value does not exist, while for UI we want to render nested fields and lazily initialize the tree up to that field, even if no value exists at all"
    - **TBD:** doesn't that also mean, that `if` shouldn't be evaluated at all if there isn't a value to evaluated?! which would restore similar behaviour like <=0.4.x validators, while being spec. compliant
    - **NOTE:** in `if` and `not` keyword validators, they no longer evaluate deeper if the value is `undefined`, which fixes the behaviour of the combination w/ conditional example! that seems to be the solution.
- [ ] rewrite the plugin adapter to allow async from start? or more the part which loops the validator fn and walks the tree.
    - how to provide react based hooks via non-react validators plugins? force to write an own widgetPlugin instead of using the default, if someone wishes to use that?
    - should work around "pausing" the validator, by stopping the loop as soon as possible, returning a state+unresolved payload, which the user must resolve and then restart validation from the state

> See also [TODO_Validate.md](./TODO_Validate.md) for more specific validator todos.

### JSON-Pointer

- added `toPointer` to create a json-pointer from `array | List`
- `pointerToKeySeq` no longer casts keys to `number`
- rewrite `resolvePointer` to work with native-JS and immutable, manually iterating all keys
    - casts the key to `number` if the current value is `array | List`, only proceeds if is not-NaN (e.g. to prevent access to `arr['length']`)
- added `walkPointer` for easier resolving of json-pointer against any data structures, incl. trees
- fixed too forgiving pointer handling, prev. trimmed `#` from e.g. `#address` and resolved `address` as property,
  now only slices `#/` and `/` from the pointer and treats just `#` as root, while using any other pointer as is,
  this behaviour may change to a fatal error for incorrect formats in a next version;
  and `#address` must be resolved using the schema resource system, as it is an `$anchor` and not pointer

### React

#### UIStore

- remodelled `UIStoreAction`
    - removed `scope` from base, now only available for `set` and `update` action
        - add helper `isAffectingValue` for "is change affecting the value scope", as now `action.scopes.includes('value')` is not enough; if no `scope` exists, it is expected that the action updates all scopes, or at least `value`
    - deprecated `effect`
        - **TODO** make async? (remove into next tick)
- added new `delete` action, only for deleting properties in objects, can has `scope`, otherwise deletes all
- basic support for `default` keywod in `list-item-add` action

Todo:

- [x] rewrite `storeUpdater` to be simpler and easier to extend
    - [x] working basics, roughly rewritten
    - [x] ~~normalized and optimized with other store/tree changes~~ treating most as internals for the moment, while providing a factory function to create action reducer
- [ ] rewrite store tree building and related nesting keys to be more robust and consistent
    - what/why:
        - all use `children` as nestKey
            - with `self` holding its own values for `internals`
            - with `valid` holding the number of errors for `validity`
                - allowing to add e.g. `errors` for full error details
        - all use `List|Map` nesting, previously `validity` didn't use `List` and stringified storeKeys
            - **TODO:** `internals` with `List` is unstable, as can have holes (push to existing list)
                - but the reason was that it would be even more complex when removing stuff and needing to shift the indexes, maybe just not initializing internals anymore?! immutable has no problem with empty slots, as long as we don't need to convert internals back to JS
                - **TODO:** add test cases for behaviour exploration: first value/internal is a nested object, then a nested object with list, then back to nested object or flat;
                  to further define how internals should be deleted, as if an object is deleted and recreated as list, its old `children` with `List` could still exist, or be useful when switching back,
                  but the `buildTree` treats any non-List or non-Map compatible value as a miss, auto-correcting the tree with it. *but does that cover the nested `.children` and where they are used?*
                  while validity is atm. contains a cleanup internally, which prevents that from (typically?) happening
        - all use fully nested structures for no key conflicts and safer nesting
    - [x] working basics, roughly rewritten
    - [x] finalized typings / initialization (as far as reasonable, more when rewriting store in 0.6.x)
- [ ] rewrite related utils, onChange actions and more
    - [x] `isInvalid`
    - [x] `onChange` in ValidityReporter
        - [x] working basics, roughly rewritten
        - [x] optimized and normalized action handler/payload
            - [x] validity support more than `valid`
            - [x] internals is bound to `self`
            - [x] normalized and optimized utils for onChange handling: `addNestKey` etc. (as far as reasonable now)
    - [ ] `extractValues` and `extractValidity` and all related:
        - [x] hooks
        - [x] existing store method `extractValues`
        - [x] `getScopedData`
        - [ ] deprecate `extractValues`
        - [x] deprecate `extractValidity`
        - [x] new store methods
            - [x] read of `validity`, separate `value`/`internals`
            - [x] ~~write of `validity`, separate `value`/`internals`~~
    - [x] `scopeUpdaterValues`/`scopeUpdaterInternals`/`scopeUpdaterValidity`

#### UIMeta

- stricter types, requires that generics extends `UIMetaContext`
- added `validate` to context
- improved context memoization
- removed HOC `withUIMeta`, use hook instead

#### SchemaResourceProvider

- better handling of $ref #135
- simple react provider and hook to consumer context, with logic from core
- replaces old combination/conditional/referencing plugins with an integration over validators
    - relies on new resource system
    - loads all needed schemas initially in root, no longer when/where a ref is actually used
    - makes `UIApi` unnecessary

#### React Plugins / WidgetEngine

- removed `ExtractStorePlugin`, included now in `WidgetEngine` directly (for the moment, experimenting performance/typing)
- removed `level` property, use ~~`schemaKeys`~~/`storeKeys` to calc. that when necessary
- removed `WidgetRenderer` from `getNextPlugin` internals, moved to `binding` directly
- removed `required`/`requiredList` in `WidgetEngine`
    - **todo:** for required info/validators are not finalized and there exist two different versions
      e.g. `RequiredPlugin` uses `parentSchema` directly for props injection, yet it should better support allOf etc.
- relies on TS5.4 for `NoInfer`
- new `widgetPlugin` and `WidgetRenderer` system, with a materialized render-stack, available as `<Next/>` prop in `widgetPlugin`, removes `currentPluginIndex`

  materializes in `UIMetaContext` and wraps each plugin in a HOC which takes care of its injections. the `Next` is available with `useUIMeta`, never render the actual `widgetsPlugins` manually or modify them dynamically.

#### WidgetsBinding

- `pluginStack` to `widgetPlugins`
    - **important:** `widgetPlugins` must not be rendered manually, only with the `Next` prop., the `widgetPlugins` must not be modified in widgets/plugins, the `Next` is materialized in the `UIMetaProvider` from the `widgetPlugins` passed to it.
- ~~`pluginSimpleStack` to `schemaPlugins`~~
- added `ObjectRenderer` as `type.object` / no longer as hard coded default
- added `NoWidget` as `NoWidget` / no longer as hard coded default
- browser error translation switched from `"t": "browser"` to `"tBy": "browser"`
- removed `schemaPlugins` and new `SchemaPluginsAdapterBuilder` which receives the plugins as initializer
- rewrite of validator-schemaPlugins into `ValidatorHandler` for new validator system
- now optional in components binding: `.GroupRenderer`
- now optional in widgets binding: `.types` and `.custom`
- rename from `widgets` to `binding`, added nested `binding.widgets` and flattened `.types` and `.custom` there
- added `.validate` to bindings, for universal reuse in any WidgetPlugin and the ValidatorPlugin, handles validation and allow custom validation rules which are used everywhere
- refactored `matchWidget` to `widgets` binding, now only as default in `WidgetRenderer`
    - must be usable outside of plugins to match and render widgets in e.g. mui `FormGroup` and other "wrapper widgets", these don't add another layer but should reuse existing bindings, e.g. only relying on `ObjectRenderer`
    - ~~to be able to add complex default for `object` and `array`, there should be a hint which tells if "inside an wrapper-widget" and thus the "native" widget should be returned~~ (see container idea)
    - (skipped for now) for better code-split, maybe remove the "widgets" completely from the context bindings, only supply through direct plugin binding, as only "types" and "components" should be used directly anyway, all other widgets should only be injected through matcher and never directly used from other widgets; for Table would require to add something like "prefer variant" or "in scope Table/Form"
- make `WidgetRenderer` and `VirtualRenderer` better integrated, remove all hard coded wiring to `VirtualWidgetRenderer`
    - moved `VirtualWidgetRenderer` into `react-json-schema` and removed defaults in `react` core
    - `isVirtual` is still handled by the `WidgetRenderer` ~~plugin~~, now if no `VirtualRenderer` is specified in binding, it won't render anything
    - some notes, not fully cleaned up:
    - ```
        - this may relate to cleaning up unwanted package deps., as `ObjectRenderer` is in `react-json-schema`, the `react` package depends on that and `json-schema`,
          which shouldn't be the case (except through system typings),
            - this can only be solved partially in the 0.5.x version, as it needs more separation between json-schema and non-json-schema related "schema",
              ... *(if that is wanted/needed at all)*
            - `json-schema` currently includes some UI-Schema typings
                - but especially the new validator system
                    - which is an implementation of the SchemaPlugin + ValidatorOutput defined in `/ui-schema`
                - ~~but also includes the typing and actual logic for schema resource building~~ moved to system
            - `react-json-schema` ~~includes the resource-provider, while `react` contains all other~~
                - (done) but a lot of non-deprecated parts will be moved to `json-schema`
                - outdated, as resource is now in system and react, but not relying on json-schema
                  ~~actually, only the `SchemaResourceProvider`, `DefaultHandler` and `ObjectRenderer` would remain, which can't be in `react` due to relying on `json-schema` for resource building,
                  and intended to be expanded with better included loaders and caching, special for react.
                  and as react specific, of course can't be moved into `json-schema`, where the rest of the resource stuff is~~
                - (done) I think, schema plugin adapter will move into here, thus more meaning and need for the `react-json-schema` package again
                - but `DefaultHandler` may be replaced with new validator, once supporting effects or alike, or will be removed when moving to central validator
            - ~~`system`~~ `/ui-schema` includes a lot of json-schema specific types and logic, just not actual validator or branching,
              but also a lot of widget rendering specific types and utils, including the translator
                - renamed again to `ui-schema`, as it contains a lot of ui-schema specific handling
                - move schema resource builder and typings here, but this adds the `json-pointer` dep. to system, which is ok for the moment
            - `react` depends on too much and includes too many parts, better in other packages
                - ~~but also `SchemaPluginsAdapter` is included in `react`, which depends on the resource system, and thus atm. maked `react` depending on `react-json-schema` and `json-schema`,
                  while it should only need the `/ui-schema` and provide the stuff which `react-json-schema` could rely on.~~
                - `VirtualWidgetRenderer` depends on `ObjectRenderer` from `react-json-schema`, while currently rather hard coded, should be moved to `react-json-schema` completely
                - (done) move schema resource provider here
      ```
- safer `value` typing
    - make `WidgetProps` always include a `value: unknown`
        - experiment with removing the current "value is removed before rendering widget" and the performance implications
    - replaced `WithValue`/`WithScalarValue` with `WithValuePlain` and otherwise use the existing `WithOnChange`
    - **Reason:** it can't be typed what "value type" a widget allows, as it could receive any (invalid) value (from e.g. remote states).
- `binding.NoWidget`/`NoWidgetProps`: renamed `matching` to `widgetId`
- (react-json-schema) `VirtualWidgetRenderer` now is value-aware when matching widget, adds support for no `type` keyword and improves multi-type support

## Todo WidgetProps

- [ ] include type guards for usage in widgets
    - maybe rely on `value` and `errors` to know if valid, needs `errors` and not `valid` to check if `TYPE_ERROR` of any other error
    - **TBD:** include for `typeof v === 'string'` or only for complex types?
- [ ] optimize/separate WidgetProps/UIMetaContext
    - UIMeta will be injected, thus will reach widget, but typing can't be ensured reliable with current recursive widgets in context itself,
      especially for some parts, like `widgets` and `t`, it would be better if users use the hooks themself
    - atm. still needed for `widgetPlugins` to work and many components depend on `widgets` as prop, but especially for "components" - not for widgets,
      and widgets are especially used by virtual-/widget-renderer, these may be replaced with using only the new matcher, yet that still needs a replacement
      for overriding the next widgets, like done in table; maybe via a new `container` prop, which would replace the overwriting with a general way to know "where mounted",
      which would imho. be `TableCell` for the current table stuff, while `Table` is the container of `TableRow` and `TableRow` is the container of `TableCell`

## Todos Misc

- [ ] tests
    - `ts-jest` needed `compilerOptions.jsx: "react"`, or not? somehow works in other repos without
        - https://github.com/kulshekhar/ts-jest/issues/63
    - [ ] type checks are disabled for tests via `isolatedModules` in `jest.config.ts`
        - but causing a lot of performance strain, from ~20-60s to over 5-20min depending on cache; thus should be always disabled for `tdd`;
          and causing CI to fail then and now; thus disabled again via env flag, but removed exclusions in `tsconfig` and with that included in normal tscheck/dtsgen
    - [ ] optimize all `ts-ignore` with better function signatures or mock data
- [x] check all `@mui` import, wrong imports lead to jest failures: "can not use import outside module"
    - never go into the third level, even for "sub bundles" like `/styles`,
      it fails when using `import useTheme from '@mui/material/styles/useTheme'`
      but works using `import { useTheme } from '@mui/material/styles'`
- [ ] clean and fix using `{}` in generics, as it often leads to "is assignable to the constraint of type C, but C could be instantiated with a different subtype of constraint {}"
    - easiest, yet very ugly workaround is typing all props like:
        - generics: `<C extends {} = {}, W extends WidgetsBindingFactory = WidgetsBindingFactory, P extends WidgetPluginProps<W> = WidgetPluginProps<W>>`
        - usage: `return <Plugin {...{ currentPluginIndex: next, ...props } as C & P} />`
    - using `object` or `Record<string, unkown>` or `Record<string, any>` does not work
    - find a better solution, especially for the `eslint` rule [@typescript-eslint/no-empty-object-type](https://typescript-eslint.io/rules/no-empty-object-type/)
    - the generic in `UIStoreProvider` causes no issue in `demo-web`, yet in `WidgetRenderer.test` causes props to be inferred as `never`, causing a lot of type errors
    - cleanup workarounds in:
        - `NextPluginRenderer`
    - **note:** solved with `NoInfer` in `WidgetEngine` and using also `object` for stricter props/context-baggage
- [ ] fix/finalize strict UISchemaMap typing and json-schema types
    - alternatively replace `StoreSchemaType` with `SomeSchema` from `/ui-schema/CommonTypings`, for a simpler type, just for enforcing immutable map
- [ ] stricter typings, with many `any` switched to `unknown`
- [x] finalize `package.json` generation for strict esm with ESM and CJS support
- [ ] finalize strict-ESM compatible imports/exports, especially in packages
    - [x] switch to strict-ESM for all core packages, with `Node16`
    - [X] switch to strict-ESM for ds-bootstrap
    - [x] switch to cjs/esm build with `.cjs` file extension instead of separate folders
    - [x] switch all packages to cjs-first and `esm` in separate folder, as otherwise not backwards compatible with esm-yet-not-type-module projects (mui5/6 compat. / `NodeNext` without `type: module`)
    - [x] change all react imports to `import * as React from 'react';` for better compatibility and to not enforce `esModuleInterop` or similar for consumers
    - [x] added test calls to ESM/CJS of build package versions, from `.js`/`.mjs`/`.cjs` files; with `type: module`, `type: commonjs` and none at all in the package.json
    - [ ] verify working behaviour once first alpha is published; sister project https://github.com/ui-schema/react-codemirror uses new build w/ MUI6 and has a verified prerelease which is used in https://github.com/control-ui/content-ui which uses NodeNext + MUI v7
- [x] control and optimize circular package dependencies, remove all which where added as workarounds
    - [x] core packages cleaned up; ds are already clean
    - [x] solve `/react` depends on `ObjectRenderer`/`VirtualWidgetRenderer` (see noted in bindings about separating packages and `VirtualWidgetRenderer`)
- [X] switched to strict esm, should no longer be needed ~~improve file/folder depth for easier usage of `no-restricted-imports` - or isn't that needed once `exports` are used?~~
    - the eslint plugin shouldn't be needed, yet a consistent depth makes the `tsconfig` for local dev easier,
      see the `ui-schema/react-codemirror` repo for a working example;
        - validated: it isn't necessary, as instead `/index.ts` files are consistently used with wildcard exports `"import": "./*/index.js"`, which is consistent for `.tsx`/`.ts` components
    - the `exports` with sub-path patterns may expose too much, where the eslint plugin makes sense again,
      depending on if the `*` maps directly to `*/index.js` or more generically to anything
- [x] normalize `tsconfig` `moduleResolution`; not possible for now, relies on too many mixed compatibilities
    - `demo-web`: as `react-immutable-editor` is pure ESM and strict ESM using `exports` with files in a sub-directory,
      the `demo-web` uses no `type: "module"` and `moduleResolution: "Bundler"` to resolve it,
      it also works with `type: "module"` and `moduleResolution: "Bundler"` - except for the remaining `.js` files,
      but the alternative with `type: "module"` and `moduleResolution: "Node16"` breaks other imports of packages not strict-ESM yet
    - `docs`: uses no `type: "module"`, as that breaks older dependencies, instead TS config contains `"module": "CommonJS", "moduleResolution": "node"`
      to support any older standards in CLI and webpack bundle, even while adjusting / testing different settings in root `tsconfig.json`
    - core packages now use `type: "module"` with `"module": "Node16", "moduleResolution": "Node16"`
- [ ] fix `pro`, or more easier/stabilized `scopeUpdater*` `UIStoreType` generic
    - somehow the `dtsgen` of `/pro` fails with type errors caused by `/react`, while react and all other don't have that issue
    - only appearing with new `storeUpdater` type, and only when importing and using the updater in the store directly
    - some basic understanding of what caused this would be helpful, for stabilization & future bug prevention, nothing more to do.
    - as a workaround removed hardcoded `storeUpdater` and moved it to `useStorePro` options, which causes no type build issues
- [ ] optimize `.d.ts` generation, switch to `rootDir` to have normalized directory names for merge-dir, not depending if anything is imported or not
    - currently intended to be defined in the package.json per package that should be generated
    - options like `composite`/`references` didn't work, except with a defined order of script execs, so most likely no option
    - a central tsgen command seems to be the easiest, which then merges the declaration files into each packages build
        - reducing type generations, only once per project
        - needs adjustments to not generate for apps like demo/docs
    - see issues:
        - https://github.com/ui-schema/ui-schema/issues/94
- [ ] try out the `publishConfig.directory` option in `package.json`
- [x] remove slate/editorjs ~~or migrate to basic react18 support~~
    - too much work for too little use cases ~~migrate from `@mui/styles`, upgrade peer deps to react18 support~~
- [x] remove schemaKeys, as they won't work in recursive references due to ever increasing keys list, also when merged in conditionals, no information if end of schemaKeys etc. exist
    - [x] remove schemaKeys
    - [x] ~~provide a util which can resolve storeKeys to applicable schemas, for splitSchema~~
        - splitSchema never used `schemaKeys`, but that use case was explained somewhere,
          the existing `InjectSplitSchemaPlugin` uses `storeKeys` and stays compatible as-is,
          while a `schemaKeys` based inject plugin was never stable, instead it should use a value-location to schema-location matcher,
          and ~~can~~ must now use the new `SchemaResource` system to resolve canonical ids and pointers, which wasn't possible beforehand,
          with a further refined resource handling and resolving, more information about all applied `$id` for a valueLocation can be used to influence style schema injection
- [ ] deprecate widget plugins and components which are replaced by new validator and schema plugins
    - `/*` means anything in that folder will be deprecated and removed in a next version (and not just the symbol with that name)
    - [x] `InjectSplitSchemaPlugin` (use schemaPlugin instead)
    - [x] `CombiningHandler/*` (new validator)
    - [x] `ConditionalHandler` (new validator)
    - [x] `DependentHandler` (new validator)
    - [x] `ReferencingHandler/*` (new schema resource + validator)
    - [x] `SchemaRootProvider/*` (new schema resource + validator)
    - [ ] `RequiredPlugin`, or keep until better solution for required behaviour?
- [x] deprecate `UIApi` (new resource system hoists loading out of widget-engine/-plugins)
- [x] deprecate `WithScalarValue`/`WithValue` (switch to `WithValuePlain` and `WithOnChange` - if needed, as now included in `WidgetProps`)
- [x] deprecate `WithValidity`, once new validation is available via hooks
- [ ] add new schema plugin: injectSplitSchema, deprecate widget plugin: InjectSplitSchema
- [x] deprecate `SchemaPlugin` methods `.should` and `.noHandle`; always use `.handle`
- [ ] enable TS rules `@typescript-eslint/no-empty-object-type, "@typescript-eslint/no-wrapper-object-types, @typescript-eslint/no-unsafe-function-type, @typescript-eslint/consistent-indexed-object-style, @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-empty-function`
- [x] move non-react schemaPlugins into json-schema packages: `InheritKeywords`, `requiredPlugin`, `sortPlugin`, `validatorPlugin`
- [x] deprecate `useUIConfig`/`UIConfigProvider`
- [x] deprecated `onErrors`, use `store.extractValidity(storeKeys)` instead; the `ValidityReporter` now includes full error details
- [ ] optimize unnecessary rendering of empty parts, e.g. `ObjectRenderer` only checks for `properties` existence, but not if empty (maybe add the `getFields` utils here?)
- [x] ~~remove or~~ just deprecate the `injectWidgetEngine`, `applyWidgetEngine` HOCs? type migration will be a headache
    - these functions never provided much optimization
    - people who need that micro optimization, should get better ways to do it their way (which now exists, also as `SchemaRootProvider` provides access to the root level schema)
    - their introduction, prevented users to focus on how to use `WidgetEngine` (or then `PluginStack`)
    - remove would allow removing all of the `StackWrapper` code in `WidgetEngine`
- [x] deprecate `applyWidgetEngine*`: `WidgetEngineInjectProps`, `AppliedWidgetEngineProps`, `applyWidgetEngine`, `injectWidgetEngine`
    - without full migration, they work like previously and are compatible with new system, but their types where not optimized/verified
- [ ] check `mergeSchema` changes and adjust to respect new applicable schema merging strategy
    - [ ] previously last-allOf overwrites, check that it is still the case
    - [ ] `$ref` extends-style chains are official in draft2020, but in contrast to UI generation - all apply concurrently, while `$ref` would be more useful for UI generation in a way of "a extends b", especially for content/ui keywords
- [x] reworked integration of `WidgetRenderer` with new `widgetPlugin`, now thew new `Next` injects the `WidgetRenderer` as the final (or first) `Next` itself
    - the binding `.WidgetRenderer` and `.widgetPlugins` are materialized in `UIMetaProvider` and `Next` rendering is started in `WidgetEngine`, the materialized and must not be modified after passing down and `widgetPlugins` must not be rendered manually, it is no longer possible to skip plugins (which was previously possible by increasing `currentPluginIndex`, yet would have been a bad pattern anyways)
- [ ] in pickers only types are migrated and props adjusted for `fullWidth`, nothing else was verified
- [ ] check/migrate `SchemaLayer` to new `WigetEngine`
- [ ] in the new schema merging, in the `object` level the property-collision conversion takes place, while in the property level it merges the `allOf` produced in the `object` level, which duplicates the keywords, should this be cleaned up internally or is it helpful to have the `allOf` still available, e.g. to access all `$ref` still in there
- [ ] demo of custom actions with a "rename property" action
- [ ] write up the (existing) storeUpdater limitations, which also are related to some `0.6.x` targets
    - e.g. `delete` does not support `deleteOnEmpty` recursively, when deleting a property, the object level won't be cleaned up, as the parent object schema is unknown when deleting a property
- [ ] define behaviour for store actions which mutate nested values, yet the store contains incompatible data, e.g. a `string` root can't be updated to an `object` just by firing the respective nested mutation
    - this undefined behaviour / normal errors isn't nice
    - an automatic correction should be optional, as imho. unexpected and may lead to more complex integration with most ORM/DMS
- [ ] provide a demo of custom store actions which use the schema resource system for more complex recursive mutations?
- [ ] check deps chain (again), clean up any remaining unnecessary dependencies
    - [x] remove dependency `@ui-schema/json-schema` from `ds-material`/`ds-bootstrap`
- [ ] update documentation
    - [ ] quick start
    - [ ] new overview
    - [x] optimized widgets section, with previous overview as index
    - [ ] separate schema related concepts and docs, like translations, and link to docs of their implementations
    - [ ] add links to validators in schema overview table? or add information about "opinionated" validators to table/footnotes?
        - [ ] at least, add basic introduction to opinionated JSON Schema evaluation for UI generation
    - [ ] replace old plugins page with overview and links to new widgetPlugins, schemaPPluginsAdapter and validator
    - [ ] for core and react, separate guides from api docs
        - [ ] create general usage guides (for react)
        - [ ] add docs for `/ui-schema`
            - **TBD:** named `core` in docs/routes, keep it or make it package name?
        - [ ] add docs for `/react`
        - [ ] add docs for `/dictionary`
        - [x] add docs for `/json-pointer` (basic)
        - [x] add docs for `/json-schema` (basic)
    - [ ] basic setup/customization guide for ds-material? or is quick-start enough, incl. demo repos?
    - [ ] basic setup/customization guide for ds-bootstrap? or is quick-start enough, incl. demo repos?
    - [ ] enable external widget packages (code/color/...) once migrated to 0.5.x
    - [ ] add redirects for important pages, via htaccess
    - [ ] scroll to headline does not work for module apis, due to lazy and without effect
    - [ ] scroll to headline does not work for cached pages, as progress has no change and thus effect is skipped
    - [ ] simpler docs page definition and normalized module-api via md-frontmatter
        - [ ] automatic md-page loading + nav registration?
        - [ ] wildcard support in docModule files definition?
        - [ ] md file normalization / loader
            - not required for wildcard, as `files` in route/spec is only used as definition, while index/extracted is used for search/viewer
        - [ ] remove unused meta data from generated API documentation, rather large JSON, as un-optimized tree with paths as ids
        - [ ] central docs mapping for packages, to remove `modulePath` and other such needed manual configuration for doc gen
    - [ ] add split-schema example in readme/docs where embedded/combined schema is shown/in quickstarts
    - [ ] update all README documentation links once docs are published

---

Prompt helper for git changes (only use AI in this project for docs)

Generate diff of important parts:

```shell
git diff master..feature/develop-0.5.0-r2 -- \
  packages \
  ':!packages/demo/**' \
  ':!packages/demo-web/**' \
  ':!packages/demo-server/**' \
  ':!packages/docs/**' \
  ':!packages/ds-bootstrap/**' \
  ':!**eslint**' \
  ':!**ignore**' \
  ':!**tsconfig**' \
  ':!**/package-lock.json' \
  > ../uis-050.patch
```

Switch `summarize` to `create a full and detailed changelog` for a long version:

```
summarize the changes described in the current file, its a git diff.

focus on lib changes and write up a changelog with all typical content and enough details. do not focus on dev suite, so changes for stuff that is only internal, and is not changing the released packages, must be ignored.

only use code file diffs. ignore any changes in markdown/documentation - as they may not reflect the latest changes!
```

> Gemini often skips over some changes, so add specific questions to get better help specific to your setup.
