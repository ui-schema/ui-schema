import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import React from "react";

const LoadingCircular = ({title}) => <React.Fragment>
    <CircularProgress color={'secondary'} style={{margin: '12px auto'}} disableShrink/>
    {title ? <Typography component={'p'} variant={'overline'} style={{textAlign: 'center', fontSize: '1em'}}>
        {title}
    </Typography> : null}
</React.Fragment>;

export {LoadingCircular}
