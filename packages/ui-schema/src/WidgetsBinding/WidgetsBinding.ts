export type WidgetsBindingRoot<TypeWidgets extends {} = {}> = {
    [K1 in keyof TypeWidgets]: TypeWidgets[K1]
}
