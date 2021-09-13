import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Theme from '../theme/theme';

import Main from '../../screens/main/main';
import Post from '../../screens/post/post';
import LikedPosts from '../../screens/liked-posts/liked-posts';

const Stack = createNativeStackNavigator();
const screenOptions = {
	headerShown: false
};

function NavigationStack() {
	return (
		<NavigationContainer theme={Theme}>
			<Stack.Navigator screenOptions={screenOptions}>
				<Stack.Screen name="Main" component={Main} />
				<Stack.Screen name="Post" component={Post} />
				<Stack.Screen name="LikedPosts" component={LikedPosts} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}

export default NavigationStack;
