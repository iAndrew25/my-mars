import React from 'react';
import {View, StyleSheet, TouchableHighlight} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import Units from '../../../units';
import Colors from '../../../colors';

function Fab({icon, onPress, ...rest}) {
	return (
		<TouchableHighlight onPress={onPress} style={StyleSheet.compose(styles.wrapper, rest)}>
			<Icon name={icon} size={Units.x3} color={Colors.white} />
		</TouchableHighlight>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		position: 'absolute',
		width: Units.x7,
		height: Units.x7,
		borderRadius: Units.x7 / 2,
		backgroundColor: 'black',
		justifyContent: 'center',
		alignItems: 'center'
	}
})

export default Fab;