# Drag 'n Drop Editor: Advanced

Toolkit for drag 'n drop UIs, using `react-dnd`, supports endless nested droppable targets. Built for "block style editors", any item must be an object having an unique ID (is calculated in lib for added ones). Supports replacing the draggable/droppable items and roots.

[![Component Examples](https://img.shields.io/badge/Examples-green?labelColor=1d3d39&color=1a6754&logoColor=ffffff&style=flat-square)](#demo-ui-generator) [![supports Material-UI Binding](https://img.shields.io/badge/Material-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=mui)](#material-ui)

- type: `object`, `array`
- widget keywords:
    - `DroppableRootMultiple`
    - `DroppableRootSingle`
    - `DroppablePanel`
- special widget components (not used for keywords):
    - `DraggableBlock`
    - `DroppableRootContent`

It is recommended, when possible, to only add a schema reference as block definition, the min. recommended is (but with full-url refs) `{"$ref": "address.json", "version": "0.1"}`, also great is `{"$ref": "address.json", "version": "0.1", "title": "Funky Block"}` to specify a custom title, it will only load the schema when really in-use.

> 🚧 Work in progress, basic for endless nested drag 'n drop works. Has hardcoded translations.

❗ Drag 'n drop from different UIGenerators is currently not forbidden, it doesn't crash the app, but if the target UIGenerator has "a same entry" (by `storeKeys`), it will move that - instead of the actually dragged one. By overwriting the `contextValue` of `DragDropBlockProvider`, you can specify custom functions `getSourceValues` and `moveDraggedValue` which should be used to e.g. get the values from higher hoisted stores, please open an issue with questions/feedback/usecases if you encounter anything.

❗ Doesn't support `required`/`deleteOnEmpty` for the array level of drag 'n drop, won't fix in the near future, as "drag between different roots in same UIGenerator" uses the whole store to get the needed data, will need a bigger adjustment for `onChange` to be able to "batch update" / "cross-receive store between batches" to get the dragged data.

## Keywords

For a block/draggable schema:

- `dragDrop.allowed`: array, when existing, only the blocks specified here are allowed, using the property names - **not** the schema `$id`

## Example Mapping

With replacing `DraggableBlock` and `DraggableRootContent` you can intercept and replace the initial-droppable zones and wrappers of the draggable blocks.

```js
import {widgets} from '@ui-schema/ds-material';
import {BlockPanel} from '@ui-schema/material-dnd/DraggableBlock/BlockPanel';
import {DroppableRootContent} from '@ui-schema/material-dnd/DroppableRoot/DroppableRootContent';
import {DroppableRootMultiple} from '@ui-schema/material-dnd/Widgets/DroppableRootMultiple';
import {DroppableRootSingle} from '@ui-schema/material-dnd/Widgets/DroppableRootSingle';
import {DroppablePanel} from '@ui-schema/material-dnd/Widgets/DroppablePanel';

const customWidgets = {...widgets};

customWidgets.DraggableBlock = BlockPanel
customWidgets.DroppableRootContent = DroppableRootContent

customWidgets.custom = {
    ...widgets.custom,
    DroppableRootMultiple: DroppableRootMultiple,
    DroppableRootSingle: DroppableRootSingle,
    DroppablePanel: DroppablePanel,
};
```

## Blocks Definitions


Example allowed for inside of blocks, here the list in `addresses` only allows blocks of `address`, any other (e.g. the root) allows everything:

```js
const blocks = {
    text: {
        type: 'object',
        properties: {
            $bid: {
                hidden: true,
                type: 'string',
            },
            $block: {
                hidden: true,
                type: 'string',
            },
            text: {
                type: 'string',
                widget: 'Text',
                view: {
                    hideTitle: true,
                },
            },
        },
        required: ['$bid', '$block'],
    },
    address: {
        $ref: 'http://localhost:4200/api/address-schema.json',
    },
    'addresses': {
        type: 'object',
        view: {
            noGrid: true,
        },
        dragDrop: {
            showOpenAll: true,
        },
        properties: {
            $bid: {
                hidden: true,
                type: 'string',
            },
            $block: {
                hidden: true,
                type: 'string',
            },
            list: {
                type: 'array',
                widget: 'DroppablePanel',
                dragDrop: {
                    allowed: ['address'],
                    nameOfBlock: {
                        en: 'address',
                        de: 'Addresse',
                    },
                },
            },
        },
        required: ['$bid', '$block'],
    },
}
```

Example allowed for root, here the root only allows `addresses` AND `address`:

```js
export const schema = createOrderedMap({
    type: 'array',
    widget: 'DroppableRootSingle',
    $defs: blocks,
    title: 'Address Editor',
    dragDrop: {
        allowed: ['address', 'addresses'],
    },
});
```

## Design System

### Material-UI

```bash
npm i --save @ui-schema/material-dnd react-dnd
```

Supports extra keywords:

- `dragDrop.showOpenAll`: boolean, when true shows a "openAll" in the droppable root
    - enabling accordion blocks (accordions are not included)
    - only for one level
    - only for widgets: `DroppableRootMultiple`, `DroppableRootSingle`
- `dragDrop.nameOfBlock`: `{[key: string]: string}`, optional, for giving some more context to "add new" buttons

```json
{
    "type": "array",
    "widget": "DroppablePanel",
    "dragDrop": {
        "allowed": ["address"],
        "nameOfBlock": {
            "en": "address",
            "de": "Addresse"
        }
    }
}
```
