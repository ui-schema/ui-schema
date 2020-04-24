import {useHistory} from 'react-router-dom';
import {useTranslation} from "react-i18next";

const loadLang = window.localStorage.getItem('i18nextLng');

const I18nRedir = ({to}) => {
    const {i18n} = useTranslation();
    const history = useHistory();

    // we can't trust i18n's current language
    // we wan't to redirect short urls like `/admin` to `/en/admin`
    // but `/admin` lead to `admin` as current language

    let estimatedLanguage = loadLang && loadLang.length === 2 ? loadLang : i18n.options.defaultLanguage;
    history.push('/' + estimatedLanguage + (to ? '/' + to : ''));

    return null;
};

export {I18nRedir}
