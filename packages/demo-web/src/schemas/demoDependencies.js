import {createOrderedMap} from "@ui-schema/system/createMap";

const schemaWDep1 = createOrderedMap({
    "type": "object",

    "properties": {
        "name": {
            "type": "string"
        },
        "credit_card": {
            "type": "string",
            "deleteOnEmpty": true,
        }
    },

    "required": ["name"],

    "dependentSchemas": {
        "credit_card": {
            "properties": {
                "billing_address": {"type": "string"}
            },
            "required": ["billing_address"]
        }
    }
});

const schemaWDep2 = createOrderedMap({
    type: "object",
    properties: {
        // here `country` is defined
        country_eu: {
            type: "boolean",
            deleteOnEmpty: true,
        },
        country_canada: {
            type: "boolean",
            deleteOnEmpty: true,
        }
    },
    dependencies: {
        country_eu: {
            properties: {
                privacy: {
                    type: "boolean",
                },
                maple_trees: {
                    minimum: 10,
                }
            },
            required: [
                "privacy"
            ]
        },
        country_canada: {
            properties: {
                maple_trees: {
                    type: "number",
                    deleteOnEmpty: true,
                }
            }
        }
    }
});

export {schemaWDep1, schemaWDep2}
