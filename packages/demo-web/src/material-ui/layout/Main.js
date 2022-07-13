import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import React from "react";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'© '}
            <Link color="inherit" href="https://i-am-digital.eu">
                Michael Becker
            </Link>{' '}
            {new Date().getFullYear()}
        </Typography>
    );
}

const Main = props => {
    const {classes, main: Main} = props;

    return <main className={classes.content}>
        <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
                <Main classes={classes}/>
            </Grid>
            <Box pt={4}>
                <Copyright/>
            </Box>
        </Container>
    </main>
};

export {Main};
