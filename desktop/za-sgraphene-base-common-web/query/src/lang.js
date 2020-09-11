import React from 'react'
import ReactDOM from 'react-dom'
import mirror, { actions, connect } from 'mirrorx'

import { IntlProvider, addLocaleData } from 'react-intl';

import intl from 'intl';
import zh from 'react-intl/locale-data/zh';
import en from 'react-intl/locale-data/en'
addLocaleData([...en, ...zh]);

import { LocaleProvider } from 'antd';
import zhTW from 'antd/lib/locale-provider/zh_TW';
import enUS from 'antd/lib/locale-provider/en_US';
import jaJP from 'antd/lib/locale-provider/ja_JP';

import Main from './main'

class App extends React.Component {  
	constructor(props){
		super(props);
	}

	componentDidMount() {
        
	}

	render() {
		const locale = navigator.language.split('-')[0];
		const lang = window.LangMessage;
		let reactLocale = T.cookie.get("lang") == "zh_TW" ? zhTW : null;
		reactLocale = T.cookie.get("lang") == "en_US" ? enUS : reactLocale;
		reactLocale = T.cookie.get("lang") == "ja_JP" ? jaJP : reactLocale;

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