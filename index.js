import React from 'react';
import {AppRegistry} from 'react-native';
import { Provider } from 'react-redux'

import NavigationStack from './src/config/navigation/navigation-stack';
import store from './src/config/store/store';

import {name as appName} from './app.json';

function App() {
	return (
		<Provider store={store}>
			<NavigationStack />
		</Provider>
	);
};

AppRegistry.registerComponent(appName, () => App);
