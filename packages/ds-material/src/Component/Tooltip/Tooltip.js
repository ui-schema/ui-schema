import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";

const AccessTooltipIcon = ({title, children}) => <React.Fragment>
    <Tooltip title={title}>
        {children}
    </Tooltip>
    <Typography component={'span'} variant={'srOnly'}>
        {title}
    </Typography>
</React.Fragment>;

export {AccessTooltipIcon}
