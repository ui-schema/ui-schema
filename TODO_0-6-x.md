# Todo 0.6.x

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
- schemaLocation vs valueLocation for schema resolving, reduction, store connection and happy path selection and rendering
- deprecate `parentSchema`, `schema` in props of widget engine, but not in widget payload
- better support for skipping `hidden` and empty schema while rendering, to not produce empty grid slots; depends also on central schema validation and building of applied UI happy paths, with some central index for stuff like hidden etc.
- reevaluate if store utils should stay in `react` or move to system
- rewrite all store related functions
    - external store with subscription system
    - full rewrite of `scopeUpdater*`; as leading to behaviour changes, should be better in `0.6.x` instead of `0.5.x`
    - unify onChange/actions-reducers config with general store config? or provide a action-reducers-plugin part to simplify customization via config. (e.g. `doNotDefault` is not known by `list-item-default`)
- instead of checking if an action is value affecting, the updater/reducers should return better what they have done, if anything at all
- after removing deprecations and working basics of the new store context, check the circular references in types of binding, WidgetPlugin, WidgetPops and UIMeta, UIStore contexts and try to remove all
- add utils/hooks for easier usage of resolved nested schemas (**TBD:** refine with new `getFields`/static fields concept)
    - `getItemsSchema` - resolve and get the `items` schema
        - needed in e.g. `TableRenderer` to know the items fields before rendering them
    - `getItemSchema(schema, index, itemValue)` - resolve and get the schema for one specific value
        - OR: `getItems(schema, index, arrValue)` - resolve and get the schema for an array, returns the values with their respective schema
    - `getPropertySchema(schema, property, propValue)` - resolve and get the schema for one specific value
        - OR: `getProperties(schema, objValue)` - resolve and get the schema for an object, returns the values with their respective schema
    - **TBD:** value-first vs schema-first vs value-aware-schema strategy
        - schema-first uses what is in schema, for widgets which work on specific data
        - value-first uses what is in schema depending on the actual value, for widgets which are more universal and could switch between `items` and `properties` depending if the value is `array` or `object`
            - which is against the predictable schema rendering, as if no value exists, it can't be decided
            - which still works reliable in e.g. list widgets, e.g. in `Table` for row-level, as a row only will be rendered if it exists in value
- add value-aware `schemaTypeIs*` support and/or integrated into the `getFields` utils
    - search for `happy-path issue` and check existing `schemaTypeIs` checks which can be optimized with value awareness
