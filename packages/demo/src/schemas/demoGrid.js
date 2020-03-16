import {createOrderedMap} from "@ui-schema/ui-schema";

const schemaGrid = columns => createOrderedMap({
    type: 'object',
    properties: {
        tree_1: {
            type: 'string',
            view: {
                sizeXs: columns,
            }
        },
        tree_2a: {
            type: 'string',
            view: {
                sizeXs: columns / 2,
            }
        },
        tree_2b: {
            type: 'string',
            view: {
                sizeXs: columns / 2,
            }
        },
        tree_3a: {
            type: 'string',
            view: {
                sizeXs: columns / 3,
            }
        },
        tree_3b: {
            type: 'string',
            view: {
                sizeXs: columns / 3,
            }
        },
        tree_3c: {
            type: 'string',
            view: {
                sizeXs: columns / 3,
            }
        },
        tree_4a: {
            type: 'string',
            view: {
                sizeXs: columns / 4,
            }
        },
        tree_4b: {
            type: 'string',
            view: {
                sizeXs: columns / 4,
            }
        },
        tree_4c: {
            type: 'string',
            view: {
                sizeXs: columns / 4,
            }
        },
        tree_4d: {
            type: 'string',
            view: {
                sizeXs: columns / 4,
            }
        },
        tree_5a: {
            type: 'string',
            view: {
                sizeXs: columns / 6,
            }
        },
        tree_5b: {
            type: 'string',
            view: {
                sizeXs: columns / 6,
            }
        },
        tree_5c: {
            type: 'string',
            view: {
                sizeXs: columns / 6,
            }
        },
        tree_5d: {
            type: 'string',
            view: {
                sizeXs: columns / 6,
            }
        },
        tree_5e: {
            type: 'string',
            view: {
                sizeXs: columns / 6,
            }
        },
        tree_5f: {
            type: 'string',
            view: {
                sizeXs: columns / 6,
            }
        },
        row_1a: {
            type: 'string',
            view: {
                sizeXs: columns / 2,
            }
        },
        row_1b: {
            type: 'string',
            view: {
                sizeXs: columns / 2,
            }
        },
        row_2: {
            type: 'object',
            view: {
                sizeXs: columns,
            },
            properties: {
                row_2a: {
                    type: 'string',
                    widget: 'Text',
                    view: {
                        rows: 1,
                        rowsMax: 5,
                        sizeXs: columns,
                        sizeMd: columns / 4,
                    }
                },
                row_2b: {
                    type: 'object',
                    view: {
                        sizeXs: columns,
                        sizeMd: columns / 2,
                    },
                    properties: {
                        row_2ba: {
                            type: 'string',
                            view: {
                                sizeXs: columns,
                                sizeMd: columns / 2,
                            }
                        },
                        row_2bb: {
                            type: 'string',
                            view: {
                                sizeXs: columns,
                                sizeMd: columns / 2,
                            }
                        },
                        row_2bc: {
                            type: 'string',
                            view: {
                                sizeXs: columns,
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
                        sizeXs: columns,
                        sizeMd: columns / 4,
                    }
                },
            }
        },
        row_3a: {
            type: 'string',
            view: {
                sizeXs: columns,
                sizeMd: columns / 2,
                sizeLg: columns / 3,
            }
        },
        row_3b: {
            type: 'string',
            view: {
                sizeXs: columns,
                sizeMd: columns / 2,
                sizeLg: columns / 3,
            }
        },
        row_3c: {
            type: 'string',
            view: {
                sizeXs: columns,
                sizeLg: columns / 3,
            }
        },
    }
});

export {schemaGrid}
