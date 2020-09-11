import React from 'react'
import { IntlProvider, addLocaleData } from 'react-intl';

import zh from 'react-intl/locale-data/zh';
import en from 'react-intl/locale-data/en';
import ja from 'react-intl/locale-data/ja';
addLocaleData([...ja, ...en, ...zh]);

import { LocaleProvider } from 'antd';

import zh_CN from 'antd/lib/locale-provider/zh_CN';
import zh_TW from 'antd/lib/locale-provider/zh_TW';
import en_US from 'antd/lib/locale-provider/en_US';
import ja_JP from 'antd/lib/locale-provider/ja_JP';
const i18nObj = { zh_TW, en_US, ja_JP, zh_CN };
import Main from './main'

class App extends React.Component {
	render() {
		const langCookie = (T.cookie.get("lang") ? T.cookie.get("lang") : 'zh_CN').replace('-', '_');
		const locale = langCookie.split('_')[0];
		const lang = window.LangMessage;
		let reactLocale = i18nObj[langCookie] || zh_CN;
		return (<div>
			<IntlProvider locale={locale} messages={lang}>
				<LocaleProvider locale={reactLocale}>
					<Main />
				</LocaleProvider>
			</IntlProvider>
		</div>
		)
	}
}

export default App;