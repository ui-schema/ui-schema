export interface WidgetsBindingRoot<TypeWidgets extends {} = {}, CustomWidgets extends {} = {}> {
    // define native `type` widgets
    types?: {
        [K1 in keyof TypeWidgets]: TypeWidgets[K1]
    }
    // define `custom` widgets
    custom?: {
        [K2 in keyof CustomWidgets]: CustomWidgets[K2]
    }
}
