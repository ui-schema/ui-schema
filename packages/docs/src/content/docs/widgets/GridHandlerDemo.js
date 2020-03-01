const demoGridHandler = [
    [
        `
### Demo Columns Non-Responsive

> this example is non-responsive and best viewed on min. 720p resolution.

1. row is xs = 12 = one widget
2. row is xs = 6 = two widgets
3. row is xs = 4 = three widgets
4. row is xs = 3 = four widgets
5. row is xs = 2 = six widgets
`,
        {
            type: 'object', properties: {
                row_1: {
                    type: 'string',
                    view: {
                        sizeXs: 12,
                    }
                },
                row_2a: {
                    type: 'string',
                    view: {
                        sizeXs: 6,
                    }
                },
                row_2b: {
                    type: 'string',
                    view: {
                        sizeXs: 6,
                    }
                },
                row_3a: {
                    type: 'string',
                    view: {
                        sizeXs: 4,
                    }
                },
                row_3b: {
                    type: 'string',
                    view: {
                        sizeXs: 4,
                    }
                },
                row_3c: {
                    type: 'string',
                    view: {
                        sizeXs: 4,
                    }
                },
                row_4a: {
                    type: 'string',
                    view: {
                        sizeXs: 3,
                    }
                },
                row_4b: {
                    type: 'string',
                    view: {
                        sizeXs: 3,
                    }
                },
                row_4c: {
                    type: 'string',
                    view: {
                        sizeXs: 3,
                    }
                },
                row_4d: {
                    type: 'string',
                    view: {
                        sizeXs: 3,
                    }
                },
                row_5a: {
                    type: 'string',
                    view: {
                        sizeXs: 2,
                    }
                },
                row_5b: {
                    type: 'string',
                    view: {
                        sizeXs: 2,
                    }
                },
                row_5c: {
                    type: 'string',
                    view: {
                        sizeXs: 2,
                    }
                },
                row_5d: {
                    type: 'string',
                    view: {
                        sizeXs: 2,
                    }
                },
                row_5e: {
                    type: 'string',
                    view: {
                        sizeXs: 2,
                    }
                },
                row_5f: {
                    type: 'string',
                    view: {
                        sizeXs: 2,
                    }
                },
            }
        }
    ], [
        `
### Demo Columns Responsive

1. row is two widgets on desktop, but split on two rows on mobile
2. row is a object nesting another grid
3. row is three widgets on desktop, two on table and \`3c\` as own row, on mobile each input has it's own row
`,
        {
            type: 'object', properties: {
                row_1a: {
                    type: 'string',
                    view: {
                        sizeXs: 6,
                    }
                },
                row_1b: {
                    type: 'string',
                    view: {
                        sizeXs: 6,
                    }
                },
                row_2: {
                    type: 'object',
                    view: {
                        sizeXs: 12,
                    },
                    properties: {
                        row_2a: {
                            type: 'string',
                            widget: 'Text',
                            view: {
                                rows: 1,
                                rowsMax: 5,
                                sizeXs: 12,
                                sizeMd: 3,
                            }
                        },
                        row_2b: {
                            type: 'object',
                            view: {
                                sizeXs: 12,
                                sizeMd: 6,
                            },
                            properties: {
                                row_2ba: {
                                    type: 'string',
                                    view: {
                                        sizeXs: 12,
                                        sizeMd: 6,
                                    }
                                },
                                row_2bb: {
                                    type: 'string',
                                    view: {
                                        sizeXs: 12,
                                        sizeMd: 6,
                                    }
                                },
                                row_2bc: {
                                    type: 'string',
                                    view: {
                                        sizeXs: 12,
                                    }
                                },
                            },
                        },
                        row_2c: {
                            type: 'string',
                            widget: 'Text',
                            view: {
                                rows: 1,
                                rowsMax: 5,
                                sizeXs: 12,
                                sizeMd: 3,
                            }
                        },
                    }
                },
                row_3a: {
                    type: 'string',
                    view: {
                        sizeXs: 12,
                        sizeMd: 6,
                        sizeLg: 4,
                    }
                },
                row_3b: {
                    type: 'string',
                    view: {
                        sizeXs: 12,
                        sizeMd: 6,
                        sizeLg: 4,
                    }
                },
                row_3c: {
                    type: 'string',
                    view: {
                        sizeXs: 12,
                        sizeLg: 4,
                    }
                },
            }
        }
    ],
];

export {demoGridHandler}
