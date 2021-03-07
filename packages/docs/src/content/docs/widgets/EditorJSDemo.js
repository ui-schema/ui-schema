export const demoEditorJS = [
    [
        ``,
        {
            type: 'object',
            properties: {
                text_1: {
                    type: 'object',
                    widget: 'EditorJS',
                    view: {
                        sizeXs: 10,
                    },
                },
                pure: {
                    type: 'string',
                    widget: 'Text',
                    view: {
                        sizeXs: 2,
                    },
                },
                text_dense: {
                    type: 'object',
                    widget: 'EditorJS',
                    view: {
                        sizeXs: 10,
                        dense: true,
                    },
                },
                pure_dense: {
                    type: 'string',
                    widget: 'Text',
                    view: {
                        sizeXs: 2,
                        dense: true,
                    },
                },
            },
        },
    ],
];
