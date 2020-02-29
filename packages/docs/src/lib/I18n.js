import React from 'react';

import i18n from 'i18next';
import {useTranslation, withTranslation, initReactI18next, I18nextProvider} from 'react-i18next';

import Backend from 'i18next-chained-backend';
import XHR from 'i18next-xhr-backend';
import LocalStorageBackend from 'i18next-localstorage-backend'
import LanguageDetector from 'i18next-browser-languagedetector';

import merge from 'webpack-merge';
import {withRouter} from "react-router-dom";

/**
 * define a custom xhr function
 *
 * @param {string} url the value of 'loadPath'
 * @param {{}} options the options object passed to i18n backend init
 * @param {function} callback is a function that takes two parameters, 'data' and 'xhr'.
 *                 - 'data' should be the key:value translation pairs for the
 *                   requested language and namespace, or null in case of an error.
 *                 - 'xhr' should be a status object, e.g. { status: 200 }
 * @param {{}} data will be a key:value object used when saving missing translations
 */
function loadLocales(url, options, callback, /*data*/) {
    try {
        import ('../locales/' + url + '.json').then(data => {
            callback(data, {status: '200'});
        });
    } catch(e) {
        console.error(e);
        callback(null, {status: '404'});
    }
}

const html = document.querySelector('html');

class I18nProviderBase extends React.Component {
    constructor(props) {
        super(props);

        const {allLanguages, expiration, pathIndex, l10n, debug} = this.props;

        const defaultLanguage = i18n && i18n.languages && i18n.languages[0] ? i18n.languages[0] : this.props.defaultLanguage;

        // load translation using xhr -> see /public/locales
        // learn more: https://github.com/i18next/i18next-xhr-backend
        i18n
            .use(Backend)
            // detect user language
            // learn more: https://github.com/i18next/i18next-browser-languageDetector
            .use(LanguageDetector)
            // pass the i18n instance to the react-i18next components.
            // Alternative use the I18nextProvider: https://react.i18next.com/components/i18nextprovider
            .use(initReactI18next)
            // init i18next
            // for all options read: https://www.i18next.com/overview/configuration-options
            .init({
                // allLanguages, debug, defaultLanguage are custom options not default by i18n, used to setup components based on i18n setup
                allLanguages,
                defaultLanguage: defaultLanguage,

                // i18n config
                debug,
                // eslint-disable-next-line
                fallbackLng: process.env.NODE_ENV === 'production' ? (defaultLanguage) : null,
                initImmediate: false,

                // `ns` and `defaultNS` must be `common` otherwise `translation.json` is still being loaded sometimes
                ns: 'common',
                defaultNS: 'common',
                fallbackNS: 'common',

                interpolation: {
                    escapeValue: false, // not needed for react as it escapes by default
                },

                // special options for react-i18next
                // learn more: https://react.i18next.com/latest/i18next-instance
                react: {bindI18n: 'languageChanged',},

                detection: {
                    order: ['path', 'localStorage'],

                    lookupLocalStorage: 'i18nextLng',
                    lookupFromPathIndex: pathIndex,

                    // cache user language on
                    caches: ['localStorage'],
                    excludeCacheFor: ['cimode'], // languages to not persist (cookie, localStorage)
                },

                backend: {
                    backends: [
                        LocalStorageBackend,  // primary
                        XHR                   // fallback
                    ],
                    backendOptions: [{
                        // prefix for stored languages
                        prefix: 'i18next_res_',

                        // expiration
                        expirationTime: expiration,

                        // language versions
                        versions: {
                            de: '0.1',
                            en: '0.1',
                            es: '0.1',
                            fr: '0.1',
                            it: '0.1',
                            pl: '0.1',
                        }
                    }, {
                        // path where resources get loaded from, or a function
                        // returning a path:
                        // function(lng, namespaces) { return customPath; }
                        // the returned path will interpolate lng, ns if provided like giving a static path
                        loadPath: (lng, /*namespaces*/) => {
                            // we use react dyn. imports so only one language per load
                            if(-1 === allLanguages.indexOf(lng[0])) {
                                // when wanted language is not known, return hard default language
                                console.error('i18n tried to load non existing language, loading default instead, tried: ', lng[0]);
                                return defaultLanguage + '/{{ns}}'
                            }
                            return '{{lng}}/{{ns}}'
                        },

                        // path to post missing resources
                        //addPath: 'locales/add/{{lng}}/{{ns}}',

                        // your backend server supports multiloading
                        // /locales/resources.json?lng=de+en&ns=ns1+ns2
                        allowMultiLoading: false, // set loadPath: '/locales/resources.json?lng={{lng}}&ns={{ns}}' to adapt to multiLoading

                        // parse data after it has been fetched
                        // in example use https://www.npmjs.com/package/json5
                        parse: (data, ident) => {
                            ident = ident.split('/');
                            const lng = ident[0];
                            const ns = ident[1];

                            // if that namespace got hardcoded overwrites from consuming app, overwrite included locales with app locales
                            if(l10n && l10n[lng] && l10n[lng][ns]) {
                                data = {...data};
                                data = merge(data, i18n[lng][ns]);
                            }
                            return data;
                        },

                        // allow cross domain requests
                        crossDomain: false,

                        // allow credentials on cross domain requests
                        withCredentials: false,

                        // define a custom xhr function
                        ajax: loadLocales,

                        // adds parameters to resource URL. 'example.com' -> 'example.com?v=1.3.5'
                        //queryStringParams: {v: '1.3.5'}
                    }]
                }
            });

        this.state = {lng: i18n.language};
    }

    componentDidMount() {
        html.lang = i18n.options.defaultLanguage;

        i18n.on('languageChanged', this.changeHtml);
    }

    componentWillUnmount() {
        i18n.off('languageChanged', this.changeHtml);
    }

    componentDidUpdate() {
        const curr = this.props.history.location.pathname.split('/')[this.props.pathIndex + 1];
        if(curr !== i18n.language) {
            // when current language in path is not like i18n, it could be because of an history pop
            i18n.changeLanguage(curr);
        }
    }

    changeHtml = (lng) => {
        html.lang = lng;
    };

    render() {
        return <I18nextProvider i18n={i18n}>
            {this.props.children}
        </I18nextProvider>;
    }
}

const I18nProvider = withRouter(I18nProviderBase);

export {
    useTranslation, withTranslation,
    i18n, I18nProvider
};
