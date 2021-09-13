import React from 'react';
import { Animated, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import Units from '../../../units';
import Colors from '../../../colors';

function Fab({ icon, onPress, ...rest }) {
	return (
		<Animated.View style={StyleSheet.compose(styles.wrapper, rest)}>
			<TouchableOpacity style={styles.content} activeOpacity={0.7} onPress={onPress}>
				<Icon name={icon} size={Units.x3} color={Colors.white} />
			</TouchableOpacity>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		width: Units.x7,
		height: Units.x7,
		position: 'absolute',
		borderRadius: Units.x7 / 2
	},
	content: {
		width: '100%',
		height: '100%',
		alignItems: 'center',
		justifyContent: 'center'
	}
});

export default Fab;
