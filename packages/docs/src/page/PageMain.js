import React from "react";
import {Paper, Typography} from "@material-ui/core";
import {PageTitle, PageContent} from "@control-ui/core/es/PageContent";
import NavProject from "../component/NavProject";
import Head from "@control-ui/core/es/Head";
import {Logo} from '../asset/logo'
import Nav from "../component/Nav";

export default function PageMain() {
    return (
        <>
            <Head
                title={'UI-Schema · Form Generator and Widget System with JSON-Schema'}
                description={'Build complex forms and UIs easily in React! Choose a design-system, write a JSON-Schema, connect the form data to your logic.'}
            />
            <PageContent>
                <PageTitle title={<span style={{display: 'flex', alignItems: 'center'}}>
                    <Logo width={55}/>
                    <span style={{marginLeft: 16, fontSize: '4rem'}}>Schema</span>
                </span>}/>

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
            </PageContent>
        </>
    );
}
