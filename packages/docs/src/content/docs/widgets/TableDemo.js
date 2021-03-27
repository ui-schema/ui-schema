export const demoTable = [
    [
        `
### Demo Table Array

Table based on array tuple schemas:
`,
        {
            type: 'array',
            widget: 'Table',
            title: 'Table of Tuples',
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
                        multipleOf: 0.01,
                    },
                ],
            },
        },
    ], [
        `
### Demo Table Object

Table based on object schemas:
`,
        {
            type: 'array',
            widget: 'Table',
            title: 'Table of Objects',
            view: {
                dense: true,
            },
            items: {
                type: 'object',
                rowSortOrder: [
                    'id',
                    'date',
                    'name',
                    'revenue',
                ],
                properties: {
                    name: {
                        type: 'string',
                        title: 'Name',
                    },
                    id: {
                        type: 'integer',
                        title: 'ID',
                        //hidden: true,
                    },
                    date: {
                        type: 'string',
                        format: 'date',
                        title: 'Date',
                        view: {
                            shrink: true,
                        },
                    },
                    revenue: {
                        type: 'number',
                        title: 'Revenue',
                        multipleOf: 0.01,
                    },
                },
            },
        },
    ],
];
