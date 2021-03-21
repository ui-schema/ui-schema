import {createOrderedMap} from '@ui-schema/ui-schema';

export const schemaDemoTable = createOrderedMap({
    type: 'array',
    widget: 'Table',
    view: {
        dense: true,
    },
    items: {
        type: 'array',
        items: [
            {
                type: 'string',
                title: 'Name',
            },
            {
                type: 'integer',
                title: 'ID',
            },
            {
                type: 'string',
                format: 'date',
                title: 'Date',
                view: {
                    shrink: true,
                },
            },
            {
                type: 'number',
                title: 'Revenue',
                multipleOf: 0.1,
            },
        ],
    },
});
