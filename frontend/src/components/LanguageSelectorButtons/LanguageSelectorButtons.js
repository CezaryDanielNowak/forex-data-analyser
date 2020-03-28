import React from 'react';
import BaseComponent from 'components/BaseComponent';

import ButtonOptions from 'components/ButtonOptions';

const langs = LANGUAGES;

const langLabels = {
  en: 'English',
  es: 'Español',
};

export default class LanguageSelectorButtons extends BaseComponent {
  className = 'ts-LanguageSelectorButtons';

  render() {
    const languages = langs.map((lang) => ({
      value: lang,
      label: langLabels[lang] || lang.toUpperCase(),
    }));

    return (
      <ButtonOptions
        { ...this.props }
        className={ this.rootcn() }
        data-test="select_language"
        options={ languages }
        value={ LANGUAGE }
        size="small"
        onChange={ (lang) => {
          const pathName = window.location.pathname
            .replace(new RegExp(`^\\/(${LANGUAGES.join('|')})\\/`), '')
            .replace(/^\//, '');
          window.location.href = `/${lang === 'en' ? '' : `${lang}/`}${pathName}`;
        } }
      />
    );
  }
}
