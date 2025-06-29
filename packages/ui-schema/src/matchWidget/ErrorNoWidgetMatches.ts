export class ErrorNoWidgetMatches extends Error {
    scope?: string
    widgetId?: string

    constructor(scope: string, widgetId: string) {
        super(`No widget matches for scope: ${JSON.stringify(scope)} and id: ${JSON.stringify(widgetId)}`)
        this.scope = scope
        this.widgetId = widgetId
    }
}
