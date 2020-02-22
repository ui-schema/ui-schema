import {createOrderedMap} from "@ui-schema/ui-schema";

const schemaGrid = createOrderedMap({
    type: 'object',
    properties: {
        tree_1: {
            type: 'string',
            view: {
                sizeXs: 12,
            }
        },
        tree_2a: {
            type: 'string',
            view: {
                sizeXs: 6,
            }
        },
        tree_2b: {
            type: 'string',
            view: {
                sizeXs: 6,
            }
        },
        tree_3a: {
            type: 'string',
            view: {
                sizeXs: 4,
            }
        },
        tree_3b: {
            type: 'string',
            view: {
                sizeXs: 4,
            }
        },
        tree_3c: {
            type: 'string',
            view: {
                sizeXs: 4,
            }
        },
        tree_4a: {
            type: 'string',
            view: {
                sizeXs: 3,
            }
        },
        tree_4b: {
            type: 'string',
            view: {
                sizeXs: 3,
            }
        },
        tree_4c: {
            type: 'string',
            view: {
                sizeXs: 3,
            }
        },
        tree_4d: {
            type: 'string',
            view: {
                sizeXs: 3,
            }
        },
        tree_5a: {
            type: 'string',
            view: {
                sizeXs: 2,
            }
        },
        tree_5b: {
            type: 'string',
            view: {
                sizeXs: 2,
            }
        },
        tree_5c: {
            type: 'string',
            view: {
                sizeXs: 2,
            }
        },
        tree_5d: {
            type: 'string',
            view: {
                sizeXs: 2,
            }
        },
        tree_5e: {
            type: 'string',
            view: {
                sizeXs: 2,
            }
        },
        tree_5f: {
            type: 'string',
            view: {
                sizeXs: 2,
            }
        },
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
});

export {schemaGrid}
