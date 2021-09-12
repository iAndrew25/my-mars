import React from 'react';
import {AppRegistry} from 'react-native';
import Main from './src/screens/main/main';
import {name as appName} from './app.json';

import StoreProvider from './src/config/store/store';

function App() {
    return (
        <StoreProvider>
            <Main />
        </StoreProvider>
    );
};

AppRegistry.registerComponent(appName, () => App);
