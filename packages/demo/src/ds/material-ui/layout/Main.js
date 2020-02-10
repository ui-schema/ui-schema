import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import React from "react";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'© '}
            <Link color="inherit" href="https://mlbr.xyz">
                Michael Becker
            </Link>{' '}
            {new Date().getFullYear()}
        </Typography>
    );
}

const Main = props => {
    const {classes, main: Main} = props;

    return <Main className={classes.content}>
        <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
                <Main classes={classes}/>
            </Grid>
            <Box pt={4}>
                <Copyright/>
            </Box>
        </Container>
    </Main>
};

export {Main};
