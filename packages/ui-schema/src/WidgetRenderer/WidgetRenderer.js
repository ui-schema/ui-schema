import React from "react";
import {List} from "immutable";
import ErrorBoundary from "react-error-boundary";
import {extractValue, withEditor,} from "../EditorStore";
import {memo} from "../Utils/memo";
import {NextPluginRenderer} from "@ui-schema/ui-schema/EditorPluginStack/EditorPluginStack";

const MyFallbackComponent = ({componentStack, error, type, widget}) => (
    <div>
        <p><strong>Error in Widget!</strong></p>
        <p><strong>Type:</strong> {type}</p>
        <p><strong>Widget:</strong> {widget}</p>
        <p><strong>Error:</strong> {error.toString()}</p>
        <p><strong>Stacktrace:</strong> {componentStack}</p>
    </div>
);

const WidgetRendererBase = (props) => {
    const {level = 0, parentSchema, storeKeys, schema} = props;

    let required = List([]);
    if(parentSchema) {
        let tmp_required = parentSchema.get('required');
        if(tmp_required) {
            required = tmp_required;
        }
    }

    const FallbackComponent = React.useCallback(
        p => <MyFallbackComponent {...p} type={schema.get('type')} widget={schema.get('widget')}/>,
        [schema]
    );

    return props.schema ? <ErrorBoundary FallbackComponent={FallbackComponent}>
        <NextPluginRenderer
            current={-1}
            // all others are getting pushed to Widget
            {...props}
            level={level}
            ownKey={storeKeys.get(storeKeys.count() - 1)}
            requiredList={required}
            required={false}
            errors={List()}
            valid
        />
    </ErrorBoundary> : null;
};
export const WidgetRenderer = withEditor(extractValue(memo(WidgetRendererBase)));
