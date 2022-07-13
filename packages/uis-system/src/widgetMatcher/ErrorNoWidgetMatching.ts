export class ErrorNoWidgetMatching extends Error {
    scope?: string
    matching?: string

    setScope(scope: string): ErrorNoWidgetMatching {
        this.scope = scope
        return this
    }

    setMatching(matching: string): ErrorNoWidgetMatching {
        this.matching = matching
        return this
    }
}
