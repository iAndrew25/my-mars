import React from 'react';
import { TouchableHighlight, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

import Colors from '../../colors';
import Units from '../../units';

function Button({ icon, text, isDisabled, ...rest }) {
	const renderContent = () => {
		if (text) {
			return (
				<Text style={StyleSheet.compose(styles.text, isDisabled ? { color: Colors.disabled } : undefined)}>{text}</Text>
			);
		} else {
			return <Icon name={icon} size={Units.x3} color={isDisabled ? Colors.disabled : Colors.primary} />;
		}
	};

	return (
		<TouchableHighlight disabled={isDisabled} style={styles.wrapper} underlayColor={Colors.underlay} {...rest}>
			{renderContent()}
		</TouchableHighlight>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		padding: Units.x1,
		borderRadius: Units.x7
	},
	text: {
		color: Colors.primary,
		fontSize: 16,
		lineHeight: 20
	}
});

export default Button;
