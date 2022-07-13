export interface WidgetBindingRoot<TW extends {} = {}, CW extends {} = {}> {
    // define native `type` widgets
    types: {
        [K1 in keyof TW]: TW[K1]
    }
    // define `custom` widgets
    custom: {
        [K2 in keyof CW]: CW[K2]
    }
}
