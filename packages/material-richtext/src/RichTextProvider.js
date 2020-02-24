import React from "react";

const RichTextContext = React.createContext({});

const RichTextProvider = ({children, ...props}) => <RichTextContext.Provider value={props} children={children}/>;

const useRichText = () => {
    return React.useContext(RichTextContext);
};

export {RichTextContext, RichTextProvider, useRichText}
