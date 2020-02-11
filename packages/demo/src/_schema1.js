/**
 * Seed the Schema with additional widgets for performance tests
 *
 * @example seedSchema(schemaDemoMain, { type: "string", view: { widthM: "1" }}, 150, 'perf_bool_'
 * @param schema
 * @param widget
 * @param qty
 * @param prefix
 */
function seedSchema(schema, widget = {
    type: "string",
}, qty = 100, prefix = 'perfcheck_') {

    for(let i = 1; i < qty; i += 1) {
        schema.properties[prefix + i] = widget;
    }

}

// seedSchema(schemaDemoMain);

export {seedSchema}
