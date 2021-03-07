# Drag 'n Drop Editor: Simple

Toolkit for drag 'n drop UIs, using `react-beautiful-dnd`, supports droppable roots at the root level only. Cannot be nested and dragged from one level to another (rbd limitation).

[![Component Examples](https://img.shields.io/badge/Examples-green?labelColor=1d3d39&color=1a6754&logoColor=ffffff&style=flat-square&logo=plex)](#demo-ui-generator) [![supports Material-UI Binding](https://img.shields.io/badge/Material-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=material-ui)](#material-ui)

- type: `object`, `array`
- widget keyword:
    - `SimpleDroppableRootMultiple`
    - `SimpleDroppableRootSingle`

> 🚧 Work in progress, basic working concept for DND. Has hardcoded translations.
>
> Maybe not developed further, but happy for PRs, at the moment focusing on [@ui-schema/material-dnd](/docs/widgets/Drag-n-Drop-Editor)

## Design System

### Material-UI

```bash
npm i --save @ui-schema/material-rbd @types/react-beautiful-dnd react-beautiful-dnd
```

```jsx
import React from 'react';
import {UIGenerator} from '@ui-schema/ui-schema/UIGenerator';
import {createEmptyStore, storeUpdater} from '@ui-schema/ui-schema/UIStore';
import {widgets} from '@ui-schema/ds-material';
import {DragDropProvider} from '@ui-schema/material-rbd/DragDropProvider/DragDropProvider';
import {makeDragDropContext} from '@ui-schema/material-rbd/DragDropProvider/makeDragDropContext';
import {DroppableRootMultiple} from '@ui-schema/material-rbd/Widgets/DroppableRootMultiple';
import {DroppableRootSingle} from '@ui-schema/material-rbd/Widgets/DroppableRootSingle';

const customWidgets = {...widgets};
customWidgets.custom = {
    ...widgets.custom,
    SimpleDroppableRootMultiple: DroppableRootMultiple,
    SimpleDroppableRootSingle: DroppableRootSingle,
};

const DraggableEditorSimple = ({schema}) => {
    const [store, setStore] = React.useState(() => createEmptyStore(schema.get('type')))
    const onChange = React.useCallback((storeKeys, scopes, updater, deleteOnEmpty, type) => {
        setStore(prevStore => {
            return storeUpdater(storeKeys, scopes, updater, deleteOnEmpty, type)(prevStore)
        })
    }, [setStore])

    // pass an object of JSON-Schemas as second parameter as possible "blocks to select"
    const dragStoreContext = makeDragDropContext(onChange, schema.get('$defs') || schema.get('definitions'))

    return <DragDropProvider contextValue={dragStoreContext.contextValue}>
        <UIGenerator
            schema={schema}
            store={store}
            onChange={onChange}
            widgets={customWidgets}
            //showValidity={showValidity}
            //t={browserT}
        />
    </DragDropProvider>
}
```
