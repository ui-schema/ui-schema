import React from 'react'
import { WidgetsBindingComponents } from '@ui-schema/ui-schema/WidgetsBinding'
import { StoreKeys } from '@ui-schema/ui-schema/UIStore'

export class PluginStackErrorBoundary extends React.Component<{
    FallbackComponent: WidgetsBindingComponents['ErrorFallback']
    type: string | unknown
    widget: string | unknown
    storeKeys: StoreKeys
}> {
    state: { error: any } = {
        error: null,
    }

    static getDerivedStateFromError(error) {
        return {error: error}
    }

    componentDidCatch(error, info) {
        console.error(error, info)
    }

    render() {
        if (this.state.error) {
            const FallbackComponent = this.props.FallbackComponent
            if (FallbackComponent) {
                return <FallbackComponent
                    error={this.state.error}
                    type={this.props.type}
                    widget={this.props.widget}
                    storeKeys={this.props.storeKeys}
                />
            }
            // todo: multi type support #68
            return 'error-' + this.props.type + (this.props.widget ? '-' + this.props.widget : '')
        }
        return this.props.children
    }
}
