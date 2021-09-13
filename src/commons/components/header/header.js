import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import Units from '../../units';
import Colors from '../../colors';

function Header({left, title, right}) {
	return (
		<View style={styles.wrapper}>
			{left}
			<Text style={StyleSheet.compose(styles.title, right ? undefined : styles.centerText)}>{title}</Text>
			{right}
		</View>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		height: Units.x7,
		alignItems: 'center',
		flexDirection: 'row',
		paddingHorizontal: Units.x1,
		justifyContent: 'space-between'
	},
	title: {
		flex: 1,
		fontSize: 18,
		lineHeight: 24,
		textAlign: 'center',
		color: Colors.primaryColor,
		fontFamily: 'PTRootUI-Medium',
	},
	centerText: {
		marginRight: Units.x4
	}
});

export default Header;