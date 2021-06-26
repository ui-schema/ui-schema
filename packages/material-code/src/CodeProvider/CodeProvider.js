import React from 'react';

export const WidgetCodeContext = React.createContext({});

export const WidgetCodeProvider = ({children, ...props}) => <WidgetCodeContext.Provider value={props} children={children}/>;

export const useWidgetCode = () => {
    return React.useContext(WidgetCodeContext);
};
