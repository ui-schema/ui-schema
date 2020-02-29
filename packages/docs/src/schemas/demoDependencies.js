import {createOrderedMap} from "@ui-schema/ui-schema";

const schemaDependencies = createOrderedMap({
    "type": "object",

    "properties": {
        "name": {
            "type": "string"
        },
        "credit_card": {
            "type": "string"
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

const dataDependencies = createOrderedMap({});

const schemaDependenciesBooleans = createOrderedMap({
    type: "object",
    properties: {
        extra_text: {
            type: "boolean",
        },
        extra_number: {
            type: "boolean",
        },
        required_number: {
            type: "boolean",
        }
    },
    dependencies: {
        extra_text: {
            properties: {
                some_text: {
                    type: "string"
                }
            },
        },
        extra_number: {
            properties: {
                some_number: {
                    type: "number"
                }
            }
        },
        required_number: {
            required: [
                "some_number"
            ]
        }
    }
});

const dataDependenciesBooleans = createOrderedMap({});

export {
    schemaDependencies, dataDependencies,
    schemaDependenciesBooleans, dataDependenciesBooleans,
}
