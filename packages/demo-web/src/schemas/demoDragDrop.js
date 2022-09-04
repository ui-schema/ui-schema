import {createOrderedMap} from '@ui-schema/system/createMap';

export const blocks = {
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
    teasers: {
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
            list: {
                type: 'array',
                widget: 'GenericList',
                view: {
                    hideTitle: true,
                },
                items: {
                    type: 'object',
                    properties: {
                        headline: {
                            type: 'string',
                        },
                        content: {
                            type: 'string',
                            widget: 'Text',
                        },
                    },
                },
            },
        },
        required: ['$bid', '$block'],
    },
    address: {
        $ref: 'http://localhost:4200/api/address-schema.json',
    },
    rich_content: {
        type: 'object',
        view: {
            noGrid: true,
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
            content: {
                type: 'array',
                widget: 'RichContent',
            },
        },
        required: ['$bid', '$block'],
    },
    'block_group': {
        type: 'object',
        view: {
            noGrid: true,
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
            },
        },
        required: ['$bid', '$block'],
    },
    'addresses': {
        type: 'object',
        view: {
            noGrid: true,
        },
        dragDrop: {
            showOpenAll: true,
            //allowed: ['address'],
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

export const schemaDragDropScoped = createOrderedMap({
    type: 'object',
    widget: 'DroppableAreas',
    title: 'Drag Drop Areas Scoped',
    dragDrop: {
        scoped: true,
    },
    view: {
        showTitle: true,
    },
    properties: {
        main: {
            type: 'array',
            //widget: 'RichContent',
        },
        suggestions: {
            type: 'array',
            //widget: 'Text',
        },
    },
});

export const schemaDragDropNested = createOrderedMap({
    type: 'object',
    widget: 'LabelBox',
    title: 'Drop Areas',
    properties: {
        main: {
            type: 'array',
            widget: 'DropArea',
            view: {
                showTitle: true,
            },
        },
        suggestions: {
            type: 'array',
            widget: 'DropArea',
            view: {
                showTitle: true,
            },
        },
    },
});

export const schemaDragDropSortableList1 = createOrderedMap({
    type: 'array',
    widget: 'SortableList',
    title: 'Sortable List',
    items: {
        type: 'object',
        title: 'Idea',
        properties: {
            headline: {
                type: 'string',
            },
            content: {
                type: 'string',
                widget: 'Text',
            },
        },
    },
});

export const schemaDragDropSortableList2 = createOrderedMap({
    type: 'array',
    widget: 'SortableList',
    title: 'Sortable List 2',
    items: {
        type: 'string',
    },
});

export const schemaDragDropSortableList3 = createOrderedMap({
    type: 'array',
    widget: 'SortableList',
    title: 'Sortable List 3',
    items: {
        type: 'array',
        widget: 'SimpleList',
        items: [{
            type: 'string',
        }, {
            type: 'number',
        }],
    },
});

export const schemaDragDropSortableList4 = createOrderedMap({
    type: 'object',
    title: 'Sortable List 4',
    properties: {
        list_main: {
            type: 'array',
            widget: 'SortableList',
            items: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                    },
                },
            },
        },
        list_nested: {
            type: 'array',
            widget: 'SortableList',
            items: {
                type: 'object',
                properties: {
                    group: {
                        type: 'string',
                    },
                    tasks: {
                        type: 'array',
                        widget: 'SortableList',
                        items: {
                            type: 'object',
                            properties: {
                                headline: {
                                    type: 'string',
                                },
                                content: {
                                    type: 'string',
                                    widget: 'Text',
                                },
                            },
                        },
                    },
                },
            },
        },
    },
});

export const schemaDragDropSortableList5 = createOrderedMap({
    type: 'properties',
    title: 'Sortable List 5',
    properties: {
        list_main: {
            type: 'array',
            widget: 'SortableList',
            items: {
                type: 'string',
            },
        },
        list_nested: {
            type: 'array',
            widget: 'SortableList',
            items: {
                type: 'array',
                widget: 'SortableList',
                items: {
                    type: 'object',
                    properties: {
                        headline: {
                            type: 'string',
                        },
                        content: {
                            type: 'string',
                            widget: 'Text',
                        },
                    },
                },
            },
        },
    },
});
