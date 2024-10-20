import { DemoWidget } from '../../../schemas/_list'

export const demoDragnDropGenericDemo: DemoWidget[] = [
    [
        `Sortable List`,
        {
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
        },
    ],
]
