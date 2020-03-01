import {createOrderedMap} from "@ui-schema/ui-schema";

const schemaCombining = createOrderedMap({
    type: "object",
    allOf: [
        {
            type: "object",
            properties: {
                street_address: {type: "string"},
                city: {type: "string"},
                state: {type: "string", widget: "Select", enum: ["illinois", "florida", "ny", "other"]}
            },
            required: ["city", "state"],
        }, {
            type: "object",
            properties: {
                phone: {type: "string"},
                email: {type: "string", format: "email"},
            },
            required: ["email"]
        }
    ]
});

const dataCombining = createOrderedMap({});

const schemaCombiningConditional = createOrderedMap({
    type: "object",
    properties: {
        address: {
            allOf: [
                {
                    type: "object",
                    properties: {
                        city: {type: "string"},
                        state: {type: "string", widget: "Select", enum: ["illinois", "florida", "ny", "other"]}
                    },
                    required: ["state"],
                    allOf: [
                        {
                            if: {
                                properties: {
                                    "state": {
                                        type: 'string',
                                        const: "illinois"
                                    }
                                }
                            },
                            then: {
                                properties: {
                                    "zip": {
                                        type: "number"
                                    }
                                },
                            },
                        }, {
                            "$comment": "Nested non-conditional schema",
                            properties: {
                                "accept": {
                                    type: 'boolean',
                                }
                            }
                        }, {
                            if: {
                                properties: {
                                    "state": {
                                        type: 'string',
                                        enum: ["ny", "florida"]
                                    }
                                }
                            },
                            then: {
                                properties: {
                                    "city": {
                                        minLength: 5,
                                    },
                                    "apartment_no": {
                                        type: "string",
                                        maximum: 15
                                    }
                                },
                                required: ["city"]
                            },
                        }, {
                            if: {
                                properties: {
                                    "state": {
                                        type: 'string',
                                        const: "florida"
                                    }
                                }
                            },
                            then: {
                                properties: {
                                    "owns_beach": {
                                        type: "boolean"
                                    }
                                },
                            },
                        },
                    ],
                }, {
                    type: "object",
                    properties: {
                        phone: {type: "string"},
                        email: {type: "string", format: "email"},
                    },
                    required: ["email"],
                    if: {
                        properties: {
                            "phone": {
                                type: 'string',
                                minLength: 6,
                            }
                        }
                    },
                    then: {
                        properties: {
                            "phone": {
                                "$comment": "only valid for: (888)555-1212 or 555-1212",
                                pattern: "^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$",
                            }
                        },
                    },
                }
            ]
        },
    }
});

const dataCombiningConditional = createOrderedMap({});

export {
    schemaCombining, dataCombining,
    schemaCombiningConditional, dataCombiningConditional,
}
