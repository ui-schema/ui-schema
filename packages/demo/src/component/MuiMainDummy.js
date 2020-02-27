import React from "react";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import {MuiSchemaDebug} from "./MuiSchemaDebug";
import {MainDummy} from "./MainDummy";

const createDummyRenderer = widgets => ({id, schema, toggleDummy, getDummy, open, classes}) => <React.Fragment>
    {open ? null : <Button style={{marginBottom: 12}} onClick={() => toggleDummy(id)} variant={getDummy(id) ? 'contained' : 'outlined'}>
        {id.replace(/([A-Z0-9])/g, ' $1').replace(/^./, str => str.toUpperCase())}
    </Button>}
    {getDummy(id) || open ? <Paper className={classes.paper}>
        <MainDummy
            schema={schema}
            Debugger={MuiSchemaDebug}
            Button={Button}
            widgets={widgets}
        />
    </Paper> : null}
</React.Fragment>;

export {createDummyRenderer}
