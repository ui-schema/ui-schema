import React from 'react';
import {Helmet} from "react-helmet";
import PropTypes from 'prop-types';

export default function Head() {
    const title = 'title';
    const description = 'description';
    const userLanguage = 'en';
    return (
        <Helmet>
            {/* Use minimum-scale=1 to enable GPU rasterization. */}
            <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width"/>
            <title>{title}</title>
            <meta name="description" content={description}/>
            {/* Twitter */}
            <meta name="twitter:card" content="summary"/>
            <meta name="twitter:site" content="@MaterialUI"/>
            <meta name="twitter:title" content={title}/>
            <meta name="twitter:description" content={description}/>
            <meta name="twitter:image" content="https://material-ui.com/static/brand.png"/>
            {/* Facebook */}
            <meta property="og:type" content="website"/>
            <meta property="og:title" content={title}/>
            {/*<meta
                property="og:url"
                content={`https://material-ui.com${Router._rewriteUrlForNextExport(router.asPath)}`}
            />*/}
            <meta property="og:description" content={description}/>
            <meta property="og:image" content="https://material-ui.com/static/brand.png"/>
            <meta property="og:ttl" content="604800"/>
            {/* Algolia */}
            <meta name="docsearch:language" content={userLanguage}/>
            <meta name="docsearch:version" content="master"/>
        </Helmet>
    );
}

Head.propTypes = {
    children: PropTypes.node,
    description: PropTypes.string,
    title: PropTypes.string,
};
