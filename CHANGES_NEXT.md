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
    - `plugins()` returns `schemaPlugins` and `widgetPlugins`
    - `widgetsTypes()` just returns `types` widgets
    - `widgetsCustom()` just returns some recommended `custom` widgets
- `pluginStack` removed, now included directly in `widgetsBinding`

### DS Bootstrap

- switched to strict esm
- update `clsx` to v2 (peer-dep)
    - as v1 is not compatible with `moduleResolution: Node16`

### System

- removed function `checkNativeValidity` in `schemaToNative`
- moved react-specific widget matching logic from `widgetMatcher` to `WidgetRenderer`

Todo:

- [ ] optimize errors typing
    - [ ] reduce immutable usage
- [ ] validators: improve value typing and functions
    - atm. validators are often strictly typed, while they also must handle any unknown value to only validate the types they are compatible with

### React

#### WidgetsBinding

- `pluginStack` to `widgetPlugins`
- `pluginSimpleStack` to `schemaPlugins`
- added `ObjectRenderer` as `type.object` / no longer as hard coded default
- added `NoWidget` as `NoWidget` / no longer as hard coded default
- browser error translation switched from `"t": "browser"` to `"tBy": "browser"`

#### React Plugins

- removed `ExtractStorePlugin`, included now in `WidgetEngine` directly (for the moment, experimenting performance/typing)
- removed `level` property, use `schemaKeys`/`storeKeys` to calc. that when necessary
- removed `WidgetRenderer` from `getNextPlugin` internals, moved to `widgetPlugins` directly

#### UIStore

- remodelled `UIStoreAction`
    - removed `scope` from base, now only available for `set` and `update` action
        - **TODO** add helper for "is value effected change"? as now `action.scopes.includes('value')` is not enough
    - deprecated `effect`
        - **TODO** make async? (remove into next tick)

Todo:

- rewrite `storeUpdater` to be simpler and easier to extend
- rewrite store tree building and related nesting keys to be more robust and consistent
    - all use `children` as nestKey
        - with `self` holding its own values for `internals`
        - with `valid` holding the number of errors for `validity`
            - allowing to add e.g. `errors` for full error details
    - all use fully nested structures for no key conflicts and safer nesting
- rewrite related utils, onChange actions and more
    - `isInvalid`
    - `onChange` in ValidityReporter
    - `extractValues` and `extractValidity` - hooks, store methods and all related

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

- `schemaPlugins`: use as initializer for the `SchemaPluginsAdapter`
- `schemaPlugins`: split generic "render style" plugins from validator affecting `schemaPlugins` into a `validator`
- add a new `SchemaValidatorPlugin` to handle validation
    - **todo:** check all current `widgetPlugins` which rely on validation, to normalize and interop with the new validator plugin and callback
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
    - [x] typechecks are ~~disabled~~ enabled for tests via `isolatedModules` in `jest.config.ts`
        - [ ] but causing a lot of performance strain, from ~60s to over 20min depending on cache; thus disabled for `tdd`
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
- [ ] try out the `publishConfig.directory` option in `package.json`
- [ ] remove slate/editorjs or migrate to basic react18 support
    - migrate from `@mui/styles`
    - upgrade peer deps to react18 support
