# Changes done

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
- `Translate/relT/relTranslator` > `translateRelative`

## General Changes

### DS Material

- adjusted root import paths, no longer exports the actual widgets directly - only with sub-folder
- `widgetsBinding` case adjusted to `*W*idgetsBinding`, no longer exports `widgets`
- `WidgetBinding | WidgetsBinding | MuiWidgetsBinding` types, folder and file names normalized to be `WidgetsBinding`
- previous `widgetsBinding.widgets` now exported with multiple modular functions:
    - separate files in `WidgetsDefault`, to be able to only import the ones really used in your app
    - import all: `import * as WidgetsDefault from '@ui-schema/ds-material/WidgetsDefault'`
    - import modular, e.g. `import {define} from '@ui-schema/ds-material/WidgetsDefault/define'`
    - `define(partialBinding)` just generates the basic structure without any plugins or widgets
        - accepts the rest of the binding as parameter
    - `plugins()` returns ~~`schemaPlugins`~~ and `widgetPlugins`
    - `widgetsTypes()` just returns `types` widgets
    - `widgetsCustom()` just returns some recommended `custom` widgets
- `pluginStack` removed, now included directly in `widgetsBinding`

### DS Bootstrap

- switched to strict esm
- update `clsx` to v2 (peer-dep)
    - as v1 is not compatible with `moduleResolution: Node16`

### System

- new universal JS utils, system, SchemaPlugins, not coupled to react dependencies
- removed function `checkNativeValidity` in `schemaToNative`
- moved react-specific widget matching logic from `widgetMatcher` to `WidgetRenderer`

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
- [ ] validator support of defaulting values, initially and after applying conditional schema
    - **tbd:** `default` handling and conditionals/selecting branches in ref/allOf/oneOf chains
- [x] validator support of composition and conditional schemas
    - `if/then/else`, `allOf`, `oneOf`, `anyOf`
    - `dependencies`
    - support of nested conditionals / chains of `if` / including `$ref`
- **TBD:** defaulting values may be needed during validation, to not flash invalid states, which requires some store-effects and bindings to `internals`
    - yet that should also be possible initially/on list actions - but how to handle conditions/composition/ref there?
- [ ] something that collects for each valueLocation/schemaLocation it's applicable schema, for then having a list of schemas which should be merged, for each field/schema location
    - [x] basic PoC with emitting applied schemas for per-layer/non-recursive validation, with an integration in ValidatorPlugin which reduces applied schemas, not just merging them
    - validators should return applicable schemas + evaluation context with evaluated-fields
        - if > adds then or else
        - allOf > return all
        - oneOf > return the first valid
        - anyOf > return the first valid
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
- **TBD:** add utils/hooks for easier usage of resolved nested schemas
    - `getItemsSchema` - resolve and get the `items` schema
        - needed in e.g. `TableRenderer` to know the items fields before rendering them
    - `getItemSchema(schema, index, itemValue)` - resolve and get the schema for one specific value
        - OR: `getItems(schema, index, arrValue)` - resolve and get the schema for an array, returns the values with their respective schema
    - `getPropertySchema(schema, property, propValue)` - resolve and get the schema for one specific value
        - OR: `getProperties(schema, objValue)` - resolve and get the schema for an object, returns the values with their respective schema
    - **TBD:** value-first vs schema-first strategy
        - schema-first uses what is in schema, for widgets which work on specific data
        - value-first uses what is in schema depending on the actual value, for widgets which are more universal and could switch between `items` and `properties` depending if the value is `array` or `object`
            - which is against the predictable schema rendering, as if no value exists, it can't be decided
            - which still works reliable in e.g. list widgets, e.g. in `Table` for row-level, as a row only will be rendered if it exists in value

> See also [CHANGES_NEXT_VALIDATE_TODOS.md](./CHANGES_NEXT_VALIDATE_TODOS.md) for more specific validator todos.

### JSON-Pointer

- added `toPointer` to create a json-pointer from `array | List`
- `pointerToKeySeq` no longer casts keys to `number`
- rewrite `resolvePointer` to work with native-JS and immutable, manually iterating all keys
    - casts the key to `number` if the current value is `array | List`, only proceeds if is not-NaN (e.g. to prevent access to `arr['length']`)
- added `walkPointer` for easier resolving of json-pointer against any data structures, incl. trees

### React

#### UIStore

- remodelled `UIStoreAction`
    - removed `scope` from base, now only available for `set` and `update` action
        - **TODO** add helper for "is value effected change"? as now `action.scopes.includes('value')` is not enough
    - deprecated `effect`
        - **TODO** make async? (remove into next tick)

Todo:

- [ ] rewrite `storeUpdater` to be simpler and easier to extend
    - [x] working basics, roughly rewritten
    - [ ] normalized and optimized with other store/tree changes
- [ ] rewrite store tree building and related nesting keys to be more robust and consistent
    - what/why:
        - all use `children` as nestKey
            - with `self` holding its own values for `internals`
            - with `valid` holding the number of errors for `validity`
                - allowing to add e.g. `errors` for full error details
        - all use `List|Map` nesting, previously `validity` didn't use `List` and stringified storeKeys
        - all use fully nested structures for no key conflicts and safer nesting
    - [x] working basics, roughly rewritten
    - [ ] finalized typings / initialization
- [ ] rewrite related utils, onChange actions and more
    - [x] `isInvalid`
    - [ ] `onChange` in ValidityReporter
        - [x] working basics, roughly rewritten
        - [ ] optimized and normalized action handler/payload
            - [ ] validity support more than `valid`
            - [x] internals is bound to `self`
            - [ ] normalized and optimized utils for onChange handling: `addNestKey` etc.
    - [ ] `extractValues` and `extractValidity` and all related:
        - [x] hooks
        - [x] existing store method `extractValues`
        - [x] `getScopedData`
        - [ ] new store methods
            - [ ] read of `validity`, separate `value`/`internals`
            - [ ] write of `validity`, separate `value`/`internals`
    - [x] `scopeUpdaterValues`/`scopeUpdaterInternals`/`scopeUpdaterValidity`

#### UIMeta

- stricter types, requires that generics extends `UIMetaContext`
- added `validate` to context
- improved context memoization

#### React Plugins / WidgetEngine

- removed `ExtractStorePlugin`, included now in `WidgetEngine` directly (for the moment, experimenting performance/typing)
- removed `level` property, use ~~`schemaKeys`~~/`storeKeys` to calc. that when necessary
- removed `WidgetRenderer` from `getNextPlugin` internals, moved to `widgetPlugins` directly
- removed `required`/`requiredList` in `WidgetEngine`
    - **todo:** for required info/validators are not finalized and there exist two different versions
      e.g. `RequiredPlugin` uses `parentSchema` directly for props injection, yet it should better support allOf etc.

Todos:

- finalize better handling of $ref #135
    - relies on new resource system
    - loads all needed schemas initially in root, no longer when/where a ref is actually used
    - makes `UIApi` unnecessary
    - ~~`ResourceBranchHandler` vs legacy `ReferencingHandler`~~
        - only resolves the current schemas $ref, no longer materialized all nested $ref
        - combines conditional and composition with $ref resolving
        - *integrated into `ValidatorPlugin`, using the `applied` schemas that are emitted by `validate`*

#### WidgetsBinding

- `pluginStack` to `widgetPlugins`
- ~~`pluginSimpleStack` to `schemaPlugins`~~
- added `ObjectRenderer` as `type.object` / no longer as hard coded default
- added `NoWidget` as `NoWidget` / no longer as hard coded default
- browser error translation switched from `"t": "browser"` to `"tBy": "browser"`
- removed `schemaPlugins` and new `SchemaPluginsAdapterBuilder` which receives the plugins as initializer
- rewrite of validator-schemaPlugins into `ValidatorHandler` for new validator system

## Todo Bindings

To make bindings more portable, some things should be refactored, removed and newly added.

New philosophy ideas:

- only functions needed independently are added in the binding
- widgets must be able to define optional and required "components", which must be able to be validated when adding the widgets binding
- `components` should not be confused with `widgetPlugins`
- if a `widgetPlugin` is relying on something in the binding, it is preferred to initialize it with it and not add it to the binding
    - except if that dependency is required inside widgets directly, outside the plugin stacks
- the widgets binding may be split up, for fewer circular dependencies in typings:
    - hooks: like validator
    - components: like NoWidget
    - `types` and `custom` could be combined and normalized as `widgets`
    - independent not usable "plugin stacks", these must be added to their widgetPlugin directly
        - with the exception to `widgetPlugins` itself (only widgetPlugins can currently execute any further logic)
            - otherwise `WidgetEngine` must be added to the widgets binding itself, which makes component-based execution very hard, the easiest is that this central component uses the respective contexts to fetch the bindings and start the execution of any further schema-layer

Todos:

- [x] add a `.validate` to bindings, for universal reuse of any WidgetPlugin and the ValidatorPlugin, handle validation and allow custom validation rules which are used everywhere
    - **todo:** check all current `widgetPlugins` which rely on validation, to normalize and interop with the new validator plugin and callback
    - **TBD:** added to `UIMetaContext` instead of `widgets` binding, rethink `widgetsBinding` more as a part of `uiMetaBinding`
- refactor `widgetMatcher` to `widgets` binding, currently internal of `WidgetRenderer`
    - must be usable outside of plugins to match and render widgets in e.g. mui `FormGroup` and other "wrapper widgets", these don't add another layer but should reuse existing bindings, e.g. only relying on `ObjectRenderer`
    - to be able to add complex default for `object` and `array`, there should be a hint which tells if "inside an wrapper-widget" and thus the "native" widget should be returned
    - for better code-split, maybe remove the "widgets" completely from the context bindings, only supply through direct plugin binding, as only "types" and "components" should be used directly anyway, all other widgets should only be injected through matcher and never directly used from other widgets; for Table would require to add something like "prefer variant" or "in scope Table/Form"
- make `WidgetRenderer` and `VirtualRenderer` better integrated, remove all hard coded wiring to `VirtualWidgetRenderer`

## Todo WidgetProps

- make `WidgetProps` always include a `value: unknown`
    - experiment with removing the current "value is removed before rendering widget" and the performance implications
- refactor `WithValue`/`WithScalarValue`
- include type guards for usage in widgets
    - maybe rely on `value` and `errors` to know if valid, needs `errors` and not `valid` to check if `TYPE_ERROR` of any other error
    - **TBD:** include for `typeof v === 'string'` or only for complex types?
- make `WidgetProps` independent of schema typing or move out of `/system`, as that package should not depend on package `/json-schema`

Reason: it can't be typed what "value type" a widget allows, as it could receive any (invalid) value (from e.g. remote states).

## Todos Misc

- [ ] tests
    - `ts-jest` needed `compilerOptions.jsx: "react"`, or not? somehow works in other repos without
        - https://github.com/kulshekhar/ts-jest/issues/63
    - [ ] type checks are disabled for tests via `isolatedModules` in `jest.config.ts`
        - but causing a lot of performance strain, from ~20-60s to over 5-20min depending on cache; thus should be always disabled for `tdd`;
          and causing CI to fail then and now; thus disabled again via env flag, but removed exclusions in `tsconfig` and with that included in normal tscheck/dtsgen
    - [ ] optimize all `ts-ignore` with better function signatures or mock data
- [ ] check all `@mui` import, wrong imports lead to jest failures: "can not use import outside module"
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
- [ ] fix/finalize strict UISchemaMap typing and json-schema types
- [ ] stricter typings, with many `any` switched to `unknown`
- [x] finalize `package.json` generation for strict esm with ESM and CJS support
- [ ] finalize strict-ESM compatible imports/exports, especially in packages
    - [x] switch to strict-ESM for all core packages, with `Node16`
    - [ ] switch to strict-ESM for ds-bootstrap
        - [ ] remove `clsx`, as not `Node16` compatible
    - [x] switch to cjs/esm build with `.cjs` file extension instead of separate folders
- [ ] control and optimize circular package dependencies, remove all which where added as workarounds
- [ ] improve file/folder depth for easier usage of `no-restricted-imports` - or isn't that needed once `exports` are used?
    - the eslint plugin shouldn't be needed, yet a consistent depth makes the `tsconfig` for local dev easier,
      see the `ui-schema/react-codemirror` repo for a working example;
        - validated: it isn't necessary, as instead the consistent `/index.ts` export is used, as this is consistent for `.tsx`/`.ts` components
    - the `exports` with sub-path patterns may expose too much, where the eslint plugin makes sense again,
      depending on if the `*` maps directly to `*/index.js` or more generically to anything
- [ ] normalize `tsconfig` `moduleResolution`
    - `demo-web`: as `react-immutable-editor` is pure ESM and strict ESM using `exports` with files in a sub-directory,
      the `demo-web` uses no `type: "module"` and `moduleResolution: "Bundler"` to resolve it,
      it also works with `type: "module"` and `moduleResolution: "Bundler"` - except for the remaining `.js` files,
      but the alternative with `type: "module"` and `moduleResolution: "Node16"` breaks other imports of packages not strict-ESM yet
    - `docs`: uses no `type: "module"`, as that breaks older dependencies, instead TS config contains `"module": "CommonJS", "moduleResolution": "node"`
      to support any older standards in CLI and webpack bundle, even while adjusting / testing different settings in root `tsconfig.json`
    - core packages now use `type: "module"` with `"module": "Node16", "moduleResolution": "Node16"`
- [ ] optimize `.d.ts` generation, switch to `rootDir` to have normalized directory names for merge-dir, not depending if anything is imported or not
    - currently intended to be defined in the package.json per package that should be generated
    - options like `composite`/`references` didn't work, except with a defined order of script execs, so most likely no option
    - a central tsgen command seems to be the easiest, which then merges the declaration files into each packages build
        - reducing type generations, only once per project
        - needs adjustments to not generate for apps like demo/docs
    - see issues:
        - https://github.com/ui-schema/ui-schema/issues/94
- [ ] try out the `publishConfig.directory` option in `package.json`
- [ ] remove slate/editorjs or migrate to basic react18 support
    - migrate from `@mui/styles`
    - upgrade peer deps to react18 support
- [x] remove schemaKeys, as they won't work in recursive references due to ever increasing keys list, also when merged in conditionals, no information if end of schemaKeys etc. exist
    - [x] remove schemaKeys
    - [x] ~~provide a util which can resolve storeKeys to applicable schemas, for splitSchema~~
        - splitSchema never used `schemaKeys`, but that use case was explained somewhere,
          the existing `InjectSplitSchemaPlugin` uses `storeKeys` and stays compatible as-is,
          while a `schemaKeys` based inject plugin was never stable, instead it should use a value-location to schema-location matcher,
          and can now use the new `SchemaResource` system to resolve canonical ids and pointers, which wasn't possible beforehand,
          with a further refined resource handling and resolving, more information about all applied `$id` for a valueLocation can be used to influence style schema injection
- [ ] deprecate `InjectSplitSchemaPlugin`, `RootProvider`, `ReferencingHandler`, ...
- [ ] add new schema plugin: injectSplitSchema, deprecate widget plugin: InjectSplitSchema
- [ ] deprecate `SchemaPlugin` methods `.should` and `.noHandle`; always use `.handle`

## Todo 0.6.x

> write up learnings and the architecture change to parse schema and validate in global state

- move validation into global state
- only keep schema plugins/widget plugins for interop and widget rendering
- the graph for which schema applies to a field, can only be built after validation,
  as that would handle `if`/`oneOf` to know which currently applies
- `default` handling is particular important to do before and maybe after validation, without flashing incorrect errors if e.g. `default` is just not applied
- store and schema positions to use for subscriptions, mutations and applicable schemas
    - `schemaKeys` won't capture complex compositional schemas (incl. $ref), thus relying on it to get the current branch/schema is impossible
    - `storeKeys` must be matched against applicable schemas, to know which are all applying
- this allows to use a valueLocation in rendering and getting the applicable schema, without the need to pass down the schema at all,
  without schema reduction done per rendered field, but based on the original tree and not an already reduced tree
    - which of course would break any existing widget-plugin based schema-manipulation - there should exist some migration path
        - this is applies especially to widget plugins which where before the validator and relied on schema and modified the value, which then the validator would already use,
          to validate but also use to evaluate conditional branches; one solution i see is to allow the validator to modify value while traversing and emitting effects for store changes, which are fired after it is done
    - the performance must be checked and compared against the render-reduction + validation approach
