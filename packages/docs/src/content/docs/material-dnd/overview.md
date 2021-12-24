# DS Material: Drag 'n Drop

Drag 'n drop enabled widgets and UI-auto generation for the UI-Schema Material-UI design system.

Uses `@ui-schema/kit-dnd` with `react-dnd` to render components based on their data and JSON-Schema/UI-Schema, connects those automatically to the UI-Schema store system.

Provides a base system for schema-driven, automatically generated, endless nestable, block based grid systems - with drag 'n drop interaction and autowired data connections.

> 🚧 Work in progress, experimental [#160](https://github.com/ui-schema/ui-schema/issues/160)
>
> ! atm. only supports `object` as list item,
> for other types you can use `@ui-schema/kit-dnd` (or any other dnd lib) to create your own widgets

- [Overview Generic Widgets](/docs/material-dnd/widgets-generic)

### Generic Usage

Uses what-is-in-the-schema to render a widget that contains drag-n-drop features, all children are restricted to movements inside their widget.

Useful for lists which don't nest, using a simplified (or full custom) rendering of the drag and/or drop list-items.

> todo: more docs
>
> todo: add support for "switching between lists of the same widget"
> todo: add support for "switching between lists of the same widget-type, e.g. in the same schema but at different positions"

### Using Block Spec.

Uses special `block` specifications to describe the allowed behaviour, to enable movement of list-items in multidimensional grid systems with a centralised store management.

Supports endless nestable blocks, with grids and special actions like "merging" blocks.

> todo: more docs

### Kit Contents

> todo: more docs

## Widgets

- generic usage (without block-spec)
    - `SortableList` [docs](/docs/material-dnd/widgets-generic)
    - *todo* `SortableAccordion`
    - *todo* `SortableGrid`
    - *todo* `NestableList`
    - *todo* `NestableGrid`
    - for `Table`
        - *todo* `SortableRow`
    - for `Media` (*todo*)
        - *todo* `Folder` which contains `Files`
        - *todo* `Gallery` which shows `Files` of type `media`
- usage with block-spec:
    - `DropArea` only as droppable target, for `type=array`
    - `DragDropArea` as draggable and droppable area, for `type=object` with one property `type=array` which will be used as droppable target
    - `DragArea` only as draggable, renders the given area schema

## WidgetsBase

- `SortableListItem`
- `AreaRenderer`

## Components

- for generic usage:
    - `DndListRenderer` to create a draggable, UI-Schema driven, drag/drop layer out of an `array`
- for usage with block-spec:
    - `DndBlocksRenderer` to create a draggable, UI-Schema driven, drag/drop layer out of an `array` using their `Block` specification
        - includes `matchBlock` function for matching the list-item-data to the respective `Block`
    - `DragDropBlockProvider`
    - `DragDropBlockSelector`

## Hooks

- `useOnDirectedMove` a hook to create the needed `onMove` function, does the needed UI-Schema store updating using the result of `onIntent`

## HOCs

- `injectBlock`

## Typings

- `DragDropSpec`
- `DragDropBlock`

## Movements

- Level
    - `up`
    - `down`
    - `same`
    - `switch`
        - todo: like wanted, a draggable can forbid specific types to be dropped on, but it is then allowed by switching a not-allowed type with an allowed type, add something like `allowedSiblings` that will be filled by the context a `block` is in
            - this also influences the order by `switch`, as currently it is not possible to order restricted areas by drag
