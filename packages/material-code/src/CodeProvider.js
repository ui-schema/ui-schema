import React from "react";

const WidgetCodeContext = React.createContext({});

const WidgetCodeProvider = ({children, ...props}) => <WidgetCodeContext.Provider value={props} children={children}/>;

/**
 * @return {{
 *   theme: string
 * }}
 */
const useWidgetCode = () => {
    return React.useContext(WidgetCodeContext);
};

export {WidgetCodeContext, WidgetCodeProvider, useWidgetCode}
