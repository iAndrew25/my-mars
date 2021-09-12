import React from 'react';
import {AppRegistry} from 'react-native';

import NavigationStack from './src/config/navigation/navigation-stack';
import StoreProvider from './src/config/store/store';

import {name as appName} from './app.json';

function App() {
	return (
		<StoreProvider>
			<NavigationStack />
		</StoreProvider>
	);
};

AppRegistry.registerComponent(appName, () => App);
