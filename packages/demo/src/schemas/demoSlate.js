import {createOrderedMap} from '@ui-schema/ui-schema';

export const schemaDemoSlate = createOrderedMap({
    type: 'object',
    properties: {
        text_1: {
            type: 'array',
            widget: 'RichContent',
            placeholder: 'Write something great!',
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
        text_2a: {
            type: 'array',
            widget: 'RichContent',
            //default: 'Something',
            view: {
                sizeXs: 10,
                sizeMd: 5,
                topControls: false,
                btnSize: 'small',
            },
        },
        text_2b: {
            type: 'array',
            widget: 'RichContent',
            view: {
                sizeXs: 10,
                sizeMd: 5,
                topControls: false,
                btnSize: 'medium',
            },
        },
        pure2: {
            type: 'string',
            widget: 'Text',
            view: {
                sizeXs: 2,
            },
        },
        text_dense: {
            type: 'array',
            widget: 'RichContent',
            view: {
                sizeXs: 10,
                topControls: false,
                dense: true,
                //hideMd: true,
            },
        },
        pure_dense: {
            type: 'string',
            widget: 'Text',
            view: {
                dense: true,
                sizeXs: 2,
            },
        },
        pure3: {
            type: 'string',
            widget: 'Text',
            view: {
                sizeXs: 2,
            },
        },
        text_default: {
            type: 'array',
            widget: 'RichContent',
            view: {
                sizeMd: 12,
            },
            default: [
                {
                    'type': 'heading-one',
                    'children': [
                        {
                            'text': 'Headline 1',
                        },
                    ],
                },
                {
                    'type': 'heading-two',
                    'children': [
                        {
                            'text': 'Headline 2',
                        },
                    ],
                },
                {
                    'type': 'heading-three',
                    'children': [
                        {
                            'text': 'Headline 3',
                        },
                    ],
                },
                {
                    'type': 'heading-four',
                    'children': [
                        {
                            'text': 'Headline 4',
                        },
                    ],
                },
                {
                    'type': 'heading-five',
                    'children': [
                        {
                            'text': 'Headline 5',
                        },
                    ],
                },
                {
                    'type': 'heading-six',
                    'children': [
                        {
                            'text': 'Headline 6',
                        },
                    ],
                },
                {
                    'type': 'p',
                    'children': [
                        {
                            'text': 'Lorem Ipsum dolor sit, this is a body 1.',
                        },
                    ],
                },
                {
                    'type': 'ul',
                    'children': [
                        {
                            'type': 'li',
                            'children': [
                                {
                                    'text': 'List',
                                },
                            ],
                        },
                        {
                            'type': 'li',
                            'children': [
                                {
                                    'text': 'List',
                                },
                            ],
                        },
                        {
                            'type': 'ul',
                            'children': [
                                {
                                    'type': 'li',
                                    'children': [
                                        {
                                            'text': 'Nested List, hard to make',
                                        },
                                    ],
                                },
                                {
                                    'type': 'li',
                                    'children': [
                                        {
                                            'text': 'As a little bit buggy',
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            'type': 'li',
                            'children': [
                                {
                                    'text': 'List End',
                                },
                            ],
                        },
                    ],
                },
                {
                    'type': 'p',
                    'children': [
                        {
                            'text': 'Lorem ipsum end of text.',
                        },
                    ],
                },
            ],
        },
        text_no_line: {
            type: 'array',
            widget: 'RichContent',
            view: {
                sizeMd: 12,
                noUnderline: true,
            },
            default: [
                {
                    'type': 'heading-one',
                    'children': [
                        {
                            'text': 'Headline 1',
                        },
                    ],
                },
                {
                    'type': 'p',
                    'children': [
                        {
                            'text': 'Lorem Ipsum dolor sit, this is a body 1.',
                        },
                    ],
                },
                {
                    'type': 'heading-two',
                    'children': [
                        {
                            'text': 'Headline 2',
                        },
                    ],
                },
                {
                    'type': 'p',
                    'children': [
                        {
                            'text': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mi quis hendrerit dolor magna eget est lorem ipsum dolor. Pellentesque dignissim enim sit amet. Bibendum est ultricies integer quis auctor. Porttitor massa id neque aliquam. Sit amet porttitor eget dolor morbi non. Hendrerit gravida rutrum quisque non tellus. Dolor sit amet consectetur adipiscing elit pellentesque habitant morbi. Mauris a diam maecenas sed enim. Nulla facilisi morbi tempus iaculis. Morbi tristique senectus et netus et malesuada fames. Amet massa vitae tortor condimentum lacinia quis vel eros donec. Magna fermentum iaculis eu non. Semper feugiat nibh sed pulvinar proin. Et malesuada fames ac turpis egestas maecenas pharetra. Morbi enim nunc faucibus a pellentesque.',
                        },
                    ],
                },
                {
                    'type': 'p',
                    'children': [
                        {
                            'text': 'Magna eget est lorem ipsum dolor sit amet consectetur adipiscing. Tempus egestas sed sed risus pretium quam vulputate dignissim. Mattis molestie a iaculis at erat. Molestie nunc non blandit massa enim nec dui nunc. Ornare lectus sit amet est placerat in egestas. Nec ullamcorper sit amet risus nullam eget felis eget. Bibendum neque egestas congue quisque egestas. Maecenas volutpat blandit aliquam etiam. Neque sodales ut etiam sit amet nisl purus in mollis. Platea dictumst vestibulum rhoncus est pellentesque. Ornare aenean euismod elementum nisi quis eleifend. Montes nascetur ridiculus mus mauris vitae ultricies leo integer malesuada.',
                        },
                    ],
                },
                {
                    'type': 'p',
                    'children': [
                        {
                            'text': 'Velit egestas dui id ornare arcu odio ut sem nulla. Pellentesque sit amet porttitor eget dolor morbi non arcu risus. Semper viverra nam libero justo laoreet. Egestas egestas fringilla phasellus faucibus scelerisque eleifend donec pretium vulputate. Ac tortor vitae purus faucibus ornare suspendisse. In fermentum posuere urna nec tincidunt praesent. Ultricies leo integer malesuada nunc vel risus. Lacus luctus accumsan tortor posuere ac ut. Venenatis a condimentum vitae sapien. Mi proin sed libero enim sed faucibus turpis in eu. Blandit libero volutpat sed cras ornare arcu.',
                        },
                    ],
                },
            ],
        },
        text_inline: {
            type: 'array',
            widget: 'RichContentInline',
            view: {
                sizeXs: 8,
                sizeMd: 5,
            },
        },
        text_inline_dense: {
            type: 'array',
            widget: 'RichContentInline',
            view: {
                sizeXs: 8,
                sizeMd: 5,
                dense: true,
            },
        },
    },
});
