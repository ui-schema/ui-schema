import {Layout} from "../Layout/Layout";
import {Container, Paper, Typography} from "@material-ui/core";
import {PageTitle} from "../Layout/PageContent";
import Nav from "../Nav";
import NavProject from "../NavProject";
import React from "react";
import Head from "../Layout/Head";
import {Logo} from '../../logo'

function PageMain() {
    return (
        <Layout>
            <Head
                title={'UI-Schema · Form Generator and Widget System with JSON-Schema'}
                description={'Build complex forms and UIs easily in React! Choose a design-system, write a JSON-Schema, connect the form data to your logic.'}
            />
            <Container maxWidth={'md'} fixed style={{display: 'flex', flexDirection: 'column', flexGrow: 2,}}>
                <PageTitle title={<span style={{display: 'flex'}}><Logo width={30}/> <span style={{marginLeft: 8}}>Schema</span></span>}/>

                <Paper style={{margin: 12, padding: 24}}>
                    <Typography component={'p'} variant={'body1'} gutterBottom>
                        <strong>UI and Form generator</strong> for React using JSON-Schema, build around a <strong>powerful widget system</strong>, made for <strong>beautiful and great experiences</strong>!
                    </Typography>
                    <Typography component={'p'} variant={'body1'} gutterBottom>
                        Widgets are defined per <strong>design-system</strong>, use the ds-binding you need or <strong>create your own</strong> easily.
                    </Typography>
                    <Typography component={'p'} variant={'body1'} gutterBottom>
                        <strong>JSON-Schema</strong> included keywords are used to describe the data and <strong>create the UI</strong> based on the data-schema and <strong>special UI keywords</strong>.
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
