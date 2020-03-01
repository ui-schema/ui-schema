import React from "react";
import {Container,} from "@material-ui/core";
import LiveEditor from '../Schema/LiveEditor'
import {Layout} from "../Layout/Layout";
import Head from "../Layout/Head";

function PageLiveEdit() {
    return <React.Fragment>
        <Head
            title={'Examples and Live-Editor · UI-Schema'}
            description={'JSON-Schema examples and the rendered UI for it, from simple to conditional combining schemas.'}
        />
        <Layout title={'Live-Editor'}>
            <Container maxWidth={false} fixed style={{display: 'flex', maxWidth: 'none', flexDirection: 'column', height: '100%', flexGrow: 2, padding: 0}}>
                <LiveEditor/>
            </Container>
        </Layout>
    </React.Fragment>;
}

export default PageLiveEdit
