import {Layout} from "../Layout/Layout";
import {Container, Paper, Typography} from "@material-ui/core";
import {PageTitle} from "../Layout/PageContent";
import Nav from "../Nav";
import NavProject from "../NavProject";
import React from "react";
import Head from "../Layout/Head";

function PageMain() {
    return (
        <Layout>
            <Head
                title={'UI-Schema · Form Generator and Widget System with JSON-Schema'}
                description={'Build complex forms and UIs easily in React! Choose a design-system, write a JSON-Schema, connect the form data to your logic.'}
            />
            <Container maxWidth={'md'} fixed style={{display: 'flex', flexDirection: 'column', flexGrow: 2,}}>
                <PageTitle title={'UI-Schema'}/>

                <Paper style={{margin: 12, padding: 24}}>
                    <Typography component={'p'} variant={'body1'} gutterBottom>
                        UI-Schema is a UI and form generator for React using JSON-Schema.
                    </Typography>
                    <Typography component={'p'} variant={'body1'} gutterBottom>
                        The core is a widget system which supports creating complex interactions and custom inputs.
                    </Typography>
                    <Typography component={'p'} variant={'body1'} gutterBottom>
                        Widgets are defined per design-system, use the design-system binding you need or create your own easily.
                    </Typography>
                </Paper>

                <Paper style={{margin: 12, padding: 24}}>
                    <Nav/>
                </Paper>

                <Paper style={{margin: 12, padding: 24}}>
                    <NavProject/>
                </Paper>
            </Container>
        </Layout>
    );
}

export default PageMain
