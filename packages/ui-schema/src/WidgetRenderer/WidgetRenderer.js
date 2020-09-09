import React from "react";
import {List} from "immutable";
import {extractValue, withEditor,} from "../EditorStore";
import {memo} from "../Utils/memo";
import {NextPluginRenderer} from "@ui-schema/ui-schema/EditorPluginStack/EditorPluginStack";
import {createValidatorErrors} from "@ui-schema/ui-schema/ValidityReporter/ValidatorErrors";

class WidgetErrorBoundary extends React.Component {
    state = {
        error: null
    }

    static getDerivedStateFromError(error) {
        return {error: error};
    }

    componentDidCatch(error, info) {
        console.error(error, info);
    }

    render() {
        if(this.state.error) {
            const FallbackComponent = this.props.FallbackComponent;
            return <FallbackComponent error={this.state.error} type={this.props.type} widget={this.props.widget}/>;
        }
        return this.props.children;
    }
}

const WidgetRendererBase = (props) => {
    const {
        level = 0, parentSchema,
        storeKeys, schema, widgets,
    } = props;

    let required = List([]);
    if(parentSchema) {
        let tmp_required = parentSchema.get('required');
        if(tmp_required) {
            required = tmp_required;
        }
    }

    const ErrorBoundary = widgets.ErrorFallback ? WidgetErrorBoundary : React.Fragment;

    return props.schema ? <ErrorBoundary
        FallbackComponent={widgets.ErrorFallback}
        type={schema.get('type')}
        widget={schema.get('widget')}
    >
        <NextPluginRenderer
            current={-1}
            // all others are getting pushed to Widget
            {...props}
            level={level}
            ownKey={storeKeys.get(storeKeys.count() - 1)}
            requiredList={required}
            required={false}
            errors={createValidatorErrors()}
            valid
        />
    </ErrorBoundary> : null;
};
export const WidgetRenderer = withEditor(extractValue(memo(WidgetRendererBase)));
