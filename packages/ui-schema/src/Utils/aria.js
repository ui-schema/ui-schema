import React from "react";
import {LiveMessenger} from "react-aria-live";
import {getDisplayName} from "./getDisplayName";

const withMessage = (Component) => {
    const WithMessage = p => {
        return <LiveMessenger>
            {({announcePolite, announceAssertive}) => <Component {...p} announcePolite={announcePolite} announceAssertive={announceAssertive}/>}
        </LiveMessenger>
    };
    WithMessage.displayName = `WithMessage(${getDisplayName(Component)})`;
    return WithMessage;
};

export {withMessage}
