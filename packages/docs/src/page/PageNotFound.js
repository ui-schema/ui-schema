import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import {PageTitle} from "@control-ui/core/es/PageContent";
import React from "react";
import Head from "@control-ui/core/es/Head";
import {Link} from "@control-ui/core/es/Link";
import Nav from "../component/Nav";
import {useTranslation} from "@control-ui/core/es/Provider/I18n";

function PageNotFound() {
    const {i18n} = useTranslation();
    return (
        <>
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
        </>
    );
}

export default PageNotFound
