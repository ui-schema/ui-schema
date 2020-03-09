import {Layout} from "../Layout/Layout";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import {PageTitle} from "../Layout/PageContent";
import Nav from "../Nav";
import React from "react";
import Head from "../Layout/Head";
import {Link} from "../Link";
import {useTranslation} from "../../lib/I18n";

function PageNotFound() {
    const {i18n} = useTranslation();
    return (
        <Layout>
            <Head
                title={'Page Not Found · UI-Schema'}
                description={''}
            />
            <Container maxWidth={'md'} fixed style={{display: 'flex', flexDirection: 'column', flexGrow: 2,}}>
                <PageTitle title={'404 Not Found'}/>

                <Paper style={{margin: 12, padding: 24}}>
                    <Typography component={'p'} variant={'body1'}>
                        <span role={'img'} aria-label={'Home Icon'}>🏠</span> <Link to={'/' + i18n.language} primary={'Home'} style={{display: 'inline-block'}}/>
                    </Typography>
                    <hr style={{opacity: 0.1, margin: '4px 0 4px 26px'}}/>
                    <Nav/>
                </Paper>
            </Container>
        </Layout>
    );
}

export {PageNotFound}
