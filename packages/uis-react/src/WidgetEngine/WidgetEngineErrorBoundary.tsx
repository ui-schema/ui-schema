import React from 'react'
import { ErrorFallbackProps } from '@ui-schema/react/Widgets'
import { StoreKeys } from '@ui-schema/react/UIStore'
import { List } from 'immutable'

export class WidgetEngineErrorBoundary extends React.Component<{
    FallbackComponent: React.ComponentType<ErrorFallbackProps>
    type: string | List<string> | undefined
    widget: string | undefined
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
            return <FallbackComponent
                error={this.state.error}
                type={this.props.type}
                widget={this.props.widget}
                storeKeys={this.props.storeKeys}
            />
        }
        return this.props.children
    }
}
