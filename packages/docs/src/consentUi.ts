import { ConsentUiInfoDefinition } from '@bemit/consent-ui/ConsentUiInfo'

const brandProvider = 'bemit'

export const customConsentUi: ConsentUiInfoDefinition = {
    prefersInitial: {
        groups: {
            measure: 2,
        },
    },
    prefersDefault: {
        groups: {
            measure: 2,
            marketing: 2,
        },
    },
    localeConsent: {
        en: {
            title: 'We value your Privacy!',
            intro: [
                'We use cookies to dip them in the milk! But here, to analyze the web site performance and success of ads.',
            ],
            desc: [
                'For creating usage reports of our websites, we and our partners may collect data regarding you and what you\'ve done on our pages and apps.',
                'Your data profile may be merged with further information, which you provided while using the services.',
            ],
            policies: {
                'bemit': 'https://bemit.eu/datenschutz',
                'google_analytics': 'https://policies.google.com/privacy',
            },
            groups: [
                {
                    id: 'essential',
                    title: 'Essential',
                    desc: 'Required technologies for this app to work.',
                    noSelect: true,
                }, {
                    id: 'measure',
                    title: 'Measurements',
                    desc: 'Help us to improve the UX and to provide a more stable service.',
                    //noSelect: true,
                },
            ],
            services: [
                {
                    id: brandProvider,
                    title: brandProvider,
                    group: 'essential',
                    desc: ['The owner of this app, provides login, register functionality and system features.'],
                    stores: [
                        {
                            title: 'Consent Manager',
                            entries: [
                                {
                                    name: '_consent',
                                    info: {
                                        //validity: 'Valid: 30d',
                                        desc: 'Used for persisting consent choice.',
                                    },
                                    is: 'local',
                                },
                            ],
                        },
                    ],
                }, {
                    id: 'hetzner',
                    title: 'Hetzner',
                    group: 'essential',
                    desc: [
                        'Provides the server infrastructure where your data is processed and exchanged',
                    ],
                    receives: ['IP', 'Name', 'Account Information', 'E-Mail', 'User Profile'],
                }, {
                    id: 'google_analytics',
                    title: 'Google Analytics',
                    group: 'measure',
                    stores: [
                        {
                            title: 'Google',
                            entries: [
                                {
                                    name: '_ga [x4]',
                                    info: {
                                        validity: '30d',
                                        desc: 'Registriert eine eindeutige ID, die verwendet wird, um statistische Daten dazu, wie der Besucher die Website nutzt, zu generieren.',
                                    },
                                    is: 'cookie',
                                    provider: 'Cookiebot Google',
                                }, {
                                    name: 'gid [x4]',
                                    info: {
                                        validity: '30d',
                                        desc: 'Registriert eine eindeutige ID, die verwendet wird, um statistische Daten dazu, wie der Besucher die Website nutzt, zu generieren.',
                                    },
                                    is: 'cookie',
                                    provider: 'Cookiebot Google',
                                }, {
                                    name: 'collect',
                                    info: {
                                        //validity: '30d',
                                        desc: 'Wird verwendet, um Daten zu Google Analytics über das Gerät und das Verhalten des Besuchers zu senden. Erfasst den Besucher über Geräte und Marketingkanäle hinweg.',
                                    },
                                    is: 'cookie',
                                    provider: 'Google',
                                }, {
                                    name: '_gat [x2]',
                                    info: {
                                        //validity: '30d',
                                        desc: 'Wird von Google Analytics verwendet, um die Anforderungsrate einzuschränken',
                                    },
                                    is: 'cookie',
                                    provider: 'Google',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    },
}
