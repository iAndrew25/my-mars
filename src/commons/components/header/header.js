import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import Units from '../../units';
import Colors from '../../colors';

function Header({left, title, right}) {
	return (
		<View style={styles.wrapper}>
			{left}
			<Text style={styles.title}>{title}</Text>
			{right}
		</View>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		height: Units.x7,
		paddingHorizontal: Units.x1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: '#ddd'
	},
	title: {
		fontSize: 18,
		lineHeight: 24,
		fontFamily: 'PTRootUI-Medium',
		color: Colors.primaryColor
	}
});

export default Header;