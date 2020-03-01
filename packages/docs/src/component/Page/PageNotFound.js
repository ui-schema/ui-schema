import {Layout} from "../Layout/Layout";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import {PageTitle} from "../Layout/PageContent";
import Nav from "../Nav";
import React from "react";
import Head from "../Layout/Head";

function PageNotFound() {
    return (
        <Layout>
            <Head
                title={'Page Not Found · UI-Schema'}
                description={''}
            />
            <Container maxWidth={'md'} fixed style={{display: 'flex', flexDirection: 'column', flexGrow: 2,}}>
                <PageTitle title={'404 Not Found'}/>

                <Paper style={{margin: 12, padding: 24}}>
                    <Nav/>
                </Paper>
            </Container>
        </Layout>
    );
}

export {PageNotFound}
