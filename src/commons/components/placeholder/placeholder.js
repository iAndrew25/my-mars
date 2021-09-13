import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

import Colors from '../../colors';

function Placeholder({ text, children }) {
	return <View style={styles.placeholder}>{text ? <Text style={styles.text}>{text}</Text> : children}</View>;
}

const styles = StyleSheet.create({
	placeholder: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	text: {
		fontFamily: 'PTRootUI-Regular',
		color: Colors.secondaryText,
		textAlign: 'center',
		lineHeight: 20,
		fontSize: 14
	}
});

export default Placeholder;
