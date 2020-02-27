import React from "react";

const RichTextContext = React.createContext({});

const RichTextProvider = ({children, ...props}) => <RichTextContext.Provider value={props} children={children}/>;

/**
 * @return {{
 *     editorState: Map,
 *     handleChange: function,
 * }}
 */
const useRichText = () => {
    return React.useContext(RichTextContext);
};

export {RichTextContext, RichTextProvider, useRichText}
