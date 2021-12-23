# Kit DnD - Drag 'n Drop Tools

A Drag 'n Drop toolkit based on `react-dnd` to simplify coding draggable lists and grid systems.

```bash
npm install --save @ui-schema/kit-dnd immutable react-dnd

# it doesn't require any other module of `@ui-schema`
```

Especially made in mind of endless nested grids and automatically generated UIs, to be compatible with any data structures (most likely).

Build around a stateless coordination system and calculating the intended UI and data actions by intended-movements (e.g. drag-hover by mouse).


> 🚧 Work in progress, experimental [#159](https://github.com/ui-schema/ui-schema/issues/159)
>
> At the moment requires that the `dataKeys` (data-coordinates) is an immutable `List`.

## Style & Animation

There is none, it's stuff around logic, there isn't any HTML included.

Use a simple `flex` layout, and you are ready to go.

## Kit Contents

### Components

- `KitDndProvider`

### Hook

- `useDraggable`
- `useOnIntent`

### Functions

- `calcIntentDataKeys`
- `calcIntentPos`
- `genId`
- `addNestKey`
- `checkIsOtherTarget`
- `moveDraggedValue`

### Typings

- `KitDnd`
- `DndValueList`

## Intents

### Intent: UI Interaction

### Intent: Data Keys
