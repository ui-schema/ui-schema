import React from "react";
import {Helmet} from "react-helmet";
import {useHistory} from "react-router-dom";
import {useTranslation} from "react-i18next";

export default function Head({title, description}) {
    const {i18n} = useTranslation();
    const history = useHistory();

    return (
        <Helmet>
            {/* Use minimum-scale=1 to enable GPU rasterization. */}
            <title>{title}</title>
            <meta name="description" content={description}/>
            {/* Twitter */}
            <meta name="twitter:card" content="summary"/>
            <meta name="twitter:site" content="@bemit_eu"/>
            <meta name="twitter:title" content={title}/>
            <meta name="twitter:description" content={description}/>
            <meta name="twitter:image" content="https://bemit.eu/out/upload/logo.png"/>
            {/* Facebook */}
            <meta property="og:type" content="website"/>
            <meta property="og:title" content={title}/>
            <meta
                property="og:url"
                content={window.location.protocol + '//' + window.location.host + history.location.pathname +
                (history.location.hash ? history.location.hash : '')}
            />
            <meta property="og:description" content={description}/>
            <meta property="og:image" content="https://bemit.eu/out/upload/logo.png"/>
            <meta property="og:ttl" content="604800"/>

            <meta name="docsearch:language" content={i18n.language}/>
            <meta name="docsearch:version" content="master"/>
        </Helmet>
    );
}
