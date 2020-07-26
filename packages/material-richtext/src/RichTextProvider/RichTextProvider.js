import React from "react";

export const RichTextContext = React.createContext({});

export const RichTextProvider = ({children, ...props}) => <RichTextContext.Provider value={props} children={children}/>;

/**
 * @return {{
 *     editorState: Map,
 *     handleChange: function,
 * }}
 */
export const useRichText = () => {
    return React.useContext(RichTextContext);
};

